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
        try {
          const { latitude, longitude } = pos.coords;
          let detectedCity = 'Local Support Centers';
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              detectedCity =
                geoData.address?.city ||
                geoData.address?.town ||
                geoData.address?.district ||
                geoData.address?.state_district ||
                geoData.address?.state ||
                'Local Support Centers';
              setLocationInput(detectedCity);
            }
          } catch (geoErr) {
            console.warn('Reverse geocoding fallback:', geoErr);
          }
          await handleSearch(detectedCity);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        alert('Location access was denied. Please enter your city or district manually.');
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-2xl border border-gov-border overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-gov-teal text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">Find Nearby Counsellors & Support Services</h3>
              <p className="text-xs text-teal-100 font-medium">
                Verified counselling centres, NGOs, and legal aid in your area
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-teal-100 hover:text-white hover:bg-gov-tealLight transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-gov-border bg-gov-cream/50 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-gov-textMuted absolute left-3 top-3" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter your city or district (e.g., Bhopal, Jaipur, Pune, Delhi)..."
                className="w-full pl-9 pr-3 py-2 bg-white text-xs sm:text-sm border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gov-teal hover:bg-gov-navy text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-gov-textMuted">
            <span>Popular: </span>
            <div className="flex gap-2">
              {['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Bengaluru'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setLocationInput(city);
                    handleSearch(city);
                  }}
                  className="text-gov-teal hover:underline font-medium"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gov-textMuted text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-gov-teal" />
              <p>Searching verified support centres and NGOs...</p>
            </div>
          ) : results ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gov-textMuted px-1">
                <span>Showing verified support resources for {searchedCity}</span>
                {results.source === 'tavily_search' && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Live Web Discovery
                  </span>
                )}
              </div>

              {(results.results || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-gov-border hover:border-gov-teal/40 rounded-lg shadow-sm transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs sm:text-sm text-gov-navy">
                      {item.title}
                    </h4>
                    {item.type && (
                      <span className="text-[10px] font-semibold bg-gov-cream text-gov-teal px-2 py-0.5 rounded border border-gov-border flex-shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gov-textMain leading-relaxed line-clamp-3">
                    {item.snippet}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone.split('/')[0].trim()}`}
                        className="inline-flex items-center gap-1 font-bold text-gov-teal hover:text-gov-navy"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call {item.phone}
                      </a>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-gov-textMuted hover:text-gov-navy underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Official Link / Details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gov-textMuted text-xs space-y-3">
              <ShieldAlert className="w-8 h-8 mx-auto text-amber-500 opacity-80" />
              <p>
                Enter your city or area above to find accredited counselling centers, free legal aid cells, and emergency resources.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gov-cream p-3 px-6 border-t border-gov-border flex items-center justify-between text-xs text-gov-textMuted">
          <span>NHAA National Toll-Free: <strong>14566</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-gov-textMain font-semibold rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
