"use client";

import { useState, useRef } from "react";
import { FiSearch, FiBook } from "react-icons/fi";

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// DOM XSS: Using innerHTML with user-controlled input

export default function BookSearchWidget() {
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleSearch() {
    if (!resultsRef.current) return;

    // INTENTIONAL: Unsafe DOM manipulation - innerHTML with user input
    resultsRef.current.innerHTML = `
      <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center gap-2 mb-2">
          <svg class="text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p class="text-gray-700 font-medium">Searching for: <strong>${query}</strong></p>
        </div>
        <p class="text-sm text-gray-500">Found 0 results for "${query}"</p>
      </div>
    `;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiBook className="text-amber-500" /> Quick Book Search
      </h3>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 focus:bg-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-[#0c1d3d] text-white rounded-xl font-semibold hover:bg-[#132b5e] transition flex items-center gap-2"
        >
          <FiSearch /> Search
        </button>
      </div>
      {/* INTENTIONAL: Results container populated via innerHTML */}
      <div ref={resultsRef} className="mt-4" id="search-results" />
    </div>
  );
}
