"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiBook, FiUsers, FiGrid, FiClock, FiArrowRight, FiMenu, FiX, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiPhone, FiMail, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaBookOpen, FaStar, FaHandshake, FaGlobe, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdMenuBook, MdLibraryBooks, MdPeople, MdCategory, MdAccessTime, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const featuredBooks = [
  { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupery", category: "Fiction", rating: 4.8 },
  { id: 2, title: "One Thousand and One Nights", author: "Anonymous", category: "Folklore", rating: 4.6 },
  { id: 3, title: "The Stranger", author: "Albert Camus", category: "Fiction", rating: 4.7 },
  { id: 4, title: "Tunisia: A History", author: "Paul Sebag", category: "History", rating: 4.5 },
  { id: 5, title: "Introduction to Algorithms", author: "Thomas Cormen", category: "Technology", rating: 4.9 },
  { id: 6, title: "The Art of War", author: "Sun Tzu", category: "Philosophy", rating: 4.7 },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#0c1d3d] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <FaBookOpen className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">Carthage Library</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Home</Link>
              <Link href="/books" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Books</Link>
              <Link href="/announcements" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Announcements</Link>
              <Link href="/contact" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Contact</Link>
              <Link href="/login" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Login</Link>
              <Link href="/register" className="bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 transition text-sm">
                Register
              </Link>
            </div>

            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-white/90 hover:text-amber-400 transition font-medium">Home</Link>
                <Link href="/books" className="text-white/90 hover:text-amber-400 transition font-medium">Books</Link>
                <Link href="/announcements" className="text-white/90 hover:text-amber-400 transition font-medium">Announcements</Link>
                <Link href="/contact" className="text-white/90 hover:text-amber-400 transition font-medium">Contact</Link>
                <Link href="/login" className="text-white/90 hover:text-amber-400 transition font-medium">Login</Link>
                <Link href="/register" className="bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 transition text-center mt-2">
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0c1d3d] via-[#132b5e] to-[#1a3a7a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <FaBookOpen className="text-amber-400 text-sm" />
              <span className="text-sm font-medium text-white/90">Bibliotheque Publique de Carthage</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover a World of <span className="text-amber-400">Knowledge</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
              Explore thousands of books, digital resources, and community programs at your public library. Your journey to knowledge starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-400 transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-amber-500/25">
                Get Your Library Card <FiArrowRight />
              </Link>
              <Link href="/books" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition flex items-center justify-center gap-2 text-lg">
                <FiSearch /> Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center border border-gray-100">
            <div className="flex-1 flex items-center gap-3 px-4">
              <FiSearch className="text-gray-400 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, categories..."
                className="w-full py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
              />
            </div>
            <Link
              href={`/books?search=${searchQuery}`}
              className="bg-[#0c1d3d] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#132b5e] transition whitespace-nowrap"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <MdLibraryBooks className="text-4xl text-[#0c1d3d]" />, value: "10,000+", label: "Books Available" },
              { icon: <MdPeople className="text-4xl text-[#0c1d3d]" />, value: "5,000+", label: "Active Members" },
              { icon: <MdCategory className="text-4xl text-[#0c1d3d]" />, value: "50+", label: "Categories" },
              { icon: <FaGlobe className="text-4xl text-[#0c1d3d]" />, value: "24/7", label: "Digital Access" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-[#0c1d3d]">{stat.value}</div>
                <div className="text-gray-500 mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Handpicked selections from our collection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <div key={book.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-[#0c1d3d] via-[#132b5e] to-[#1a3a7a] flex items-center justify-center relative overflow-hidden">
                  <FaBookOpen className="text-6xl text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaStar className="text-xs" /> {book.rating}
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-3">{book.category}</span>
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-amber-600 transition">{book.title}</h3>
                  <p className="text-gray-500 text-sm">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Announcements</h2>
              <p className="text-gray-500 text-lg">Stay updated with library news</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.map((ann: any) => (
                <div key={ann.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                    <FiCalendar className="text-amber-500 text-xl" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{ann.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{ann.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>By {ann.author}</span>
                    <span>{new Date(ann.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours & CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Opening Hours</h2>
              <div className="space-y-4">
                {[
                  { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
                  { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
                  { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <MdAccessTime className="text-[#0c1d3d] text-xl" />
                      <span className="font-medium text-gray-700">{item.day}</span>
                    </div>
                    <span className="font-bold text-[#0c1d3d]">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0c1d3d] to-[#132b5e] text-white rounded-3xl p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-3xl opacity-20" />
              <h2 className="text-3xl font-bold mb-4 relative">Join Our Library</h2>
              <p className="text-white/70 mb-8 text-lg relative leading-relaxed">
                Get your free library card today and access thousands of books and digital resources.
              </p>
              <Link href="/register" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-amber-400 transition w-fit relative flex items-center gap-2 shadow-lg shadow-amber-500/25">
                Register Now <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FaBookOpen className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold">Bibliotheque Publique de Carthage</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Serving the community since 1952. Our library is a public space dedicated to education, culture, and knowledge sharing.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition">
                    <Icon className="text-white" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <div className="space-y-3 text-sm">
                <Link href="/books" className="block text-gray-400 hover:text-amber-400 transition">Browse Books</Link>
                <Link href="/announcements" className="block text-gray-400 hover:text-amber-400 transition">Announcements</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition">Contact Us</Link>
                <Link href="/register" className="block text-gray-400 hover:text-amber-400 transition">Get a Card</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact Info</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-amber-400" /> 123 Avenue de Carthage, Tunis
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-amber-400" /> +216 70 000 000
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-amber-400" /> contact@bibliotheque-carthage.example.test
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            &copy; 2026 Bibliotheque Publique de Carthage. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
