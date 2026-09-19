"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiCalendar } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0c1d3d] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <FaBookOpen className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold hidden sm:block">Carthage Library</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Home</Link>
              <Link href="/books" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Books</Link>
              <Link href="/announcements" className="text-amber-400 font-medium text-sm">Announcements</Link>
              <Link href="/contact" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Contact</Link>
              <Link href="/login" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Login</Link>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-500 mb-8">Stay updated with library news and events</p>

        <div className="space-y-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="text-amber-500 text-xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{ann.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    By {ann.author} — {new Date(ann.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="mt-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: ann.content }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FiCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No announcements available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
