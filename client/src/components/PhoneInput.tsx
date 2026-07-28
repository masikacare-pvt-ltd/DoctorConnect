import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { COUNTRIES, Country, DEFAULT_COUNTRY } from '../utils/countries';

interface PhoneInputProps {
  value: string; // Phone number without country code
  countryCode: string; // e.g. "+91"
  countryIso: string; // e.g. "IN"
  onChange: (phone: string, countryCode: string, countryIso: string) => void;
  error?: string;
  id?: string;
  placeholder?: string;
}

export default function PhoneInput({
  value,
  countryIso,
  onChange,
  error,
  id = 'phone-input',
  placeholder = '(555) 000-0000',
}: PhoneInputProps) {
  // Find selected country or fallback to remember/default
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (countryIso) {
      const match = COUNTRIES.find((c) => c.iso === countryIso);
      if (match) return match;
    }
    const savedIso = localStorage.getItem('last_selected_country_iso');
    if (savedIso) {
      const match = COUNTRIES.find((c) => c.iso === savedIso);
      if (match) return match;
    }
    return DEFAULT_COUNTRY;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal selected country with props if countryIso changes externally
  useEffect(() => {
    if (countryIso && countryIso !== selectedCountry.iso) {
      const match = COUNTRIES.find((c) => c.iso === countryIso);
      if (match) setSelectedCountry(match);
    }
  }, [countryIso]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem('last_selected_country_iso', country.iso);
    setIsOpen(false);
    setSearch('');
    onChange(value, country.code, country.iso);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    onChange(newPhone, selectedCountry.code, selectedCountry.iso);
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.iso.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-4 focus-within:ring-slate-100 transition-all">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors shrink-0"
          id={`${id}-country-selector`}
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-mono font-bold text-slate-700">{selectedCountry.code}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          id={id}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-white text-sm focus:outline-none transition-all ${
            error ? 'border-rose-400' : ''
          }`}
        />
      </div>

      {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}

      {/* Country Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 max-h-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country, code, ISO..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-1 divide-y divide-slate-50">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No countries found</div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.iso === selectedCountry.iso;
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors ${
                      isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({c.iso})</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="font-mono text-slate-500">{c.code}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
