'use client';

import React, { useState } from 'react';
import { searchNearbySupport } from '../lib/api';
import { MapPin, Search, Phone, ExternalLink, X, ShieldAlert, Loader2 } from 'lucide-react';

export default function NearbySupportModal({ isOpen, onClose }) {
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searchedCity, setSearchedCity] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (cityToSearch) => {
    const city = cityToSearch || locationInput.trim() || 'Delhi';
    setLoading(true);
    setSearchedCity(city);
    try {
      const data = await searchNearbySupport(city);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your city manually.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Use generic coords or default city search
        handleSearch('Local Support Centers');
      },
      (err) => {
        setLoading(false);
        alert('Location access was denied. Please enter your city or district manually.');
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-800 max-w-2xl w-full rounded-xl shadow-2xl border border-gov-border dark:border-slate-700 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-gov-teal dark:bg-teal-900 text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Find Nearby Counsellors & Support Services</h3>
              <p className="text-[11px] sm:text-xs text-teal-100 font-medium">
                Verified counselling centres, NGOs, and legal aid in your area
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-md text-teal-100 hover:text-white hover:bg-gov-tealLight transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b border-gov-border dark:border-slate-700 bg-gov-cream/50 dark:bg-slate-900/50 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-gov-textMuted dark:text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter city or district (e.g. Bhopal, Jaipur, Pune, Delhi)..."
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 text-xs sm:text-sm text-gov-textMain dark:text-slate-100 border border-gov-border dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-gov-teal hover:bg-gov-navy text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gov-textMuted dark:text-slate-400">
            <span>Popular: </span>
            <div className="flex flex-wrap gap-2">
              {['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Bengaluru'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setLocationInput(city);
                    handleSearch(city);
                  }}
                  className="text-gov-teal dark:text-teal-400 hover:underline font-medium py-0.5"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gov-textMuted dark:text-slate-400 text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-gov-teal dark:text-teal-400" />
              <p>Searching verified support centres and NGOs...</p>
            </div>
          ) : results ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gov-textMuted dark:text-slate-400 px-1">
                <span>Showing verified support resources for {searchedCity}</span>
                {results.source === 'tavily_search' && (
                  <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Live Web Discovery
                  </span>
                )}
              </div>

              {(results.results || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-slate-800/90 border border-gov-border dark:border-slate-700 hover:border-gov-teal/40 rounded-lg shadow-sm transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs sm:text-sm text-gov-navy dark:text-slate-100">
                      {item.title}
                    </h4>
                    {item.type && (
                      <span className="text-[10px] font-semibold bg-gov-cream dark:bg-slate-700 text-gov-teal dark:text-teal-300 px-2 py-0.5 rounded border border-gov-border dark:border-slate-600 flex-shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gov-textMain dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.snippet}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone.split('/')[0].trim()}`}
                        className="inline-flex items-center gap-1 font-bold text-gov-teal dark:text-teal-400 hover:text-gov-navy dark:hover:text-teal-300 min-h-[32px]"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call {item.phone}
                      </a>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-gov-textMuted dark:text-slate-400 hover:text-gov-navy dark:hover:text-slate-200 underline min-h-[32px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Official Link / Details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gov-textMuted dark:text-slate-400 text-xs space-y-3">
              <ShieldAlert className="w-8 h-8 mx-auto text-amber-500 opacity-80" />
              <p>
                Enter your city or area above to find accredited counselling centers, free legal aid cells, and emergency resources.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gov-cream dark:bg-slate-900 p-3.5 px-5 sm:px-6 border-t border-gov-border dark:border-slate-800 flex items-center justify-between text-xs text-gov-textMuted dark:text-slate-400">
          <span>NHAA National Toll-Free: <strong className="text-gov-navy dark:text-slate-200">14566</strong></span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-gov-textMain dark:text-slate-200 font-semibold rounded min-h-[36px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
