import React, { useState, useEffect, useRef } from 'react';
import { X, Plane } from 'lucide-react';
import { fetchAirports, fetchFrequentAirports } from '../services/airApi';

export default function AirportAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Origin",
  label = "Origin",
  id = "airport-autocomplete",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync internal query with incoming value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Load airports when query changes or when opened
  useEffect(() => {
    let active = true;

    async function load() {
      if (!isOpen) return;

      if (!query || !query.trim()) {
        const frequent = await fetchFrequentAirports();
        if (active) {
          setAirports(frequent);
          setHighlightedIndex(-1);
        }
      } else {
        const matches = await fetchAirports(query);
        if (active) {
          setAirports(matches);
          setHighlightedIndex(matches.length > 0 ? 0 : -1);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [query, isOpen]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);
    setIsOpen(true);
  };

  const handleSelectAirport = (airport) => {
    const formatted = `${airport.city} (${airport.code})`;
    setQuery(formatted);
    if (onChange) onChange(formatted);
    if (onSelect) onSelect(airport);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < airports.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : airports.length - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && airports[highlightedIndex]) {
        e.preventDefault();
        handleSelectAirport(airports[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-[11px] font-semibold text-gray-500 tracking-wide mb-0.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-transparent border-0 p-0 pr-6 focus:outline-none focus:ring-0 truncate"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-0 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition"
            title="Clear"
            tabIndex={-1}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown matching IRCTC Air ss3 & ss4 */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-[280px] sm:w-[320px] bg-white rounded-md shadow-2xl border border-gray-300 z-[100] max-h-[320px] overflow-y-auto divide-y divide-gray-200 animate-in fade-in zoom-in-95 duration-100"
          role="listbox"
        >
          {airports.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-500 text-center">
              No matching airports found for "{query}"
            </div>
          ) : (
            airports.map((airport, index) => {
              const isSelected = highlightedIndex === index;
              return (
                <div
                  key={`${airport.code}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectAirport(airport)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition select-none text-left ${
                    isSelected ? 'bg-amber-50 text-gray-900' : 'bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-sm font-semibold tracking-tight text-gray-900 truncate">
                      {airport.city} ({airport.code})
                    </div>
                    {airport.name && (
                      <div className="text-[11px] text-gray-500 truncate leading-tight">
                        {airport.name}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-gray-900 shrink-0 uppercase tracking-wider pl-2">
                    {airport.countryCode || 'IN'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
