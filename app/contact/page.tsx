"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMenu, FiX, FiCheck } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }

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
              <Link href="/announcements" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Announcements</Link>
              <Link href="/contact" className="text-amber-400 font-medium text-sm">Contact</Link>
              <Link href="/login" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Login</Link>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">We would love to hear from you</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
                <FiCheck className="text-green-500 text-xl" />
                <div>
                  <div className="font-semibold">Message sent!</div>
                  <div className="text-sm">Thank you. We will respond shortly.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 focus:bg-white transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => update("subject", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea required value={form.message} onChange={(e) => update("message", e.target.value)} rows={5}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 focus:bg-white transition resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0c1d3d] text-white py-3.5 rounded-xl font-semibold hover:bg-[#132b5e] transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#0c1d3d]/20">
                  {loading ? "Sending..." : <><FiSend /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-600 text-sm">123 Avenue de Carthage<br />Tunis, Tunisia</div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-amber-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">+216 70 000 000</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-amber-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">contact@bibliotheque-carthage.example.test</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-amber-500" /> Hours
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Mon-Fri</span><span className="font-medium text-gray-900">8:00 AM - 8:00 PM</span></div>
                <div className="flex justify-between text-gray-600"><span>Saturday</span><span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between text-gray-600"><span>Sunday</span><span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
