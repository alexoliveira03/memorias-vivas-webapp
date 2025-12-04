import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { countryCodes } from '../lib/countryCodes';

export default function CountryCodeSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter countries based on search
    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dial_code.includes(search) ||
        country.code.toLowerCase().includes(search.toLowerCase())
    );

    // Find selected country object
    const selectedCountry = countryCodes.find(c => c.dial_code === value) || countryCodes.find(c => c.dial_code === '+55');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 focus:border-violet-500 focus:outline-none transition-all flex items-center justify-between gap-1"
            >
                <span className="font-medium truncate">{value}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 max-h-80 bg-[#0f0f16] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                    {/* Search Header */}
                    <div className="p-3 border-b border-white/5 bg-[#1a1a24]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500 placeholder-gray-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Country List */}
                    <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    onClick={() => {
                                        onChange(country.dial_code);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center justify-between group ${value === country.dial_code ? 'bg-violet-500/10' : ''}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="text-xs font-bold text-gray-500 w-6">{country.code}</span>
                                        <span className="text-sm text-gray-200 truncate">{country.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${value === country.dial_code ? 'text-violet-400' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                            {country.dial_code}
                                        </span>
                                        {value === country.dial_code && <Check size={14} className="text-violet-500" />}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No country found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
