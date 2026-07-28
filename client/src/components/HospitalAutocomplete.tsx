import React, { useState, useEffect, useRef } from 'react';
import { Building, Plus, Check, Loader2 } from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';

interface HospitalAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  placeholder?: string;
}

interface HospitalItem {
  id: string;
  hospitalName: string;
}

export default function HospitalAutocomplete({
  value,
  onChange,
  error,
  id = 'hospital-autocomplete',
  placeholder = 'Saint Mary Medical Center',
}: HospitalAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchHospitals = (query: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiGet(`/api/hospitals?q=${encodeURIComponent(query.trim())}`);
        if (res?.data) {
          setSuggestions(res.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 350); // 350ms debounce
  };

  useEffect(() => {
    if (isOpen) {
      fetchHospitals(value);
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    setIsOpen(true);
  };

  const handleSelect = (hospitalName: string) => {
    onChange(hospitalName);
    setIsOpen(false);
  };

  const handleCreateNew = async () => {
    const trimmed = value.trim();
    if (!trimmed || creating) return;
    setCreating(true);
    try {
      const res = await apiPost('/api/hospitals', { hospitalName: trimmed });
      const createdName = res?.data?.hospitalName || trimmed;
      onChange(createdName);
      setIsOpen(false);
    } catch {
      onChange(trimmed);
      setIsOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const exactMatch = suggestions.some(
    (h) => h.hospitalName.toLowerCase() === value.trim().toLowerCase()
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 bg-white border ${
            error ? 'border-rose-400' : 'border-slate-200'
          } rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`}
        />
      </div>

      {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}

      {isOpen && (value.trim().length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto p-1 divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
          {loading ? (
            <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching hospitals...
            </div>
          ) : suggestions.length === 0 && !value.trim() ? (
            <div className="p-3 text-center text-xs text-slate-400">Type to search hospitals</div>
          ) : (
            suggestions.map((h) => {
              const isSelected = h.hospitalName.toLowerCase() === value.trim().toLowerCase();
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleSelect(h.hospitalName)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors ${
                    isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{h.hospitalName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                </button>
              );
            })
          )}

          {value.trim().length > 0 && !exactMatch && (
            <button
              type="button"
              onClick={handleCreateNew}
              disabled={creating}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add &quot;{value.trim()}&quot; to database</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
