import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Plus, Check, Loader2 } from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';
import { DESIGNATIONS } from '../utils/constants';

interface DesignationSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
}

interface DesignationItem {
  id: string;
  name: string;
}

export default function DesignationSelect({
  value,
  onChange,
  error,
  id = 'designation-select',
}: DesignationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Initialize with built-in default designations instantly (sorted alphabetically)
  const [items, setItems] = useState<DesignationItem[]>(() =>
    [...DESIGNATIONS].sort().map((d, idx) => ({ id: `default-${idx}`, name: d }))
  );
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchDesignations = async (query: string) => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/designations?q=${encodeURIComponent(query)}`);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setItems(res.data);
      } else {
        // Combine static constants with query filter as reliable fallback
        const filtered = [...DESIGNATIONS]
          .filter((d) => d.toLowerCase().includes(query.toLowerCase()))
          .sort()
          .map((d, idx) => ({ id: `default-${idx}`, name: d }));
        setItems(filtered);
      }
    } catch {
      const filtered = [...DESIGNATIONS]
        .filter((d) => d.toLowerCase().includes(query.toLowerCase()))
        .sort()
        .map((d, idx) => ({ id: `default-${idx}`, name: d }));
      setItems(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDesignations(search);
    }
  }, [isOpen, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setSearch('');
  };

  const handleCreate = async () => {
    const trimmed = search.trim();
    if (!trimmed || creating) return;
    setCreating(true);
    try {
      const res = await apiPost('/api/designations', { name: trimmed });
      const createdName = res?.data?.name || trimmed;
      onChange(createdName);
      setIsOpen(false);
      setSearch('');
    } catch {
      onChange(trimmed);
      setIsOpen(false);
      setSearch('');
    } finally {
      setCreating(false);
    }
  };

  // Case-insensitive check if searched text matches any existing designation exactly
  const exactMatch = items.some(
    (item) => item.name.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-white border ${
          error ? 'border-rose-400' : 'border-slate-200'
        } rounded-lg text-sm flex items-center justify-between text-left focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`}
      >
        <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
          {value || 'Select Designation'}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </button>

      {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or type custom designation..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto p-1 divide-y divide-slate-50">
            {loading && items.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
              </div>
            ) : items.length === 0 && !search.trim() ? (
              <div className="p-4 text-center text-xs text-slate-400">No designations found</div>
            ) : (
              items.map((item) => {
                const isSelected = item.name === value;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors ${
                      isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}

            {/* Create custom designation option */}
            {search.trim() && !exactMatch && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Create &quot;{search.trim()}&quot;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
