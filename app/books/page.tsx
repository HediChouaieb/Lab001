"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiBook, FiFilter, FiMenu, FiX } from "react-icons/fi";
import { FaBookOpen, FaStar } from "react-icons/fa";

function BooksContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [books, setBooks] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const perPage = 12;

  useEffect(() => { fetchBooks(); }, [search, category, page]);

  async function fetchBooks() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", String(page));
    params.set("limit", String(perPage));
    const res = await fetch(`/api/books?${params.toString()}`);
    const data = await res.json();
    setBooks(data.books || []);
    setTotal(data.total || 0);
  }

  const categories = ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Art", "Philosophy", "Children", "Reference", "Periodicals"];
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h1>
        <p className="text-gray-500">Browse our collection of {total} books</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or author..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="pl-12 pr-8 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white appearance-none min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {search && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <FiSearch className="text-blue-500" />
          <span className="text-gray-700">
            Results for: <strong dangerouslySetInnerHTML={{ __html: search }} />
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-40 bg-gradient-to-br from-[#0c1d3d] via-[#132b5e] to-[#1a3a7a] flex items-center justify-center relative">
              <FaBookOpen className="text-5xl text-white/20 group-hover:scale-110 transition-transform duration-500" />
              {book.available > 0 && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  Available
                </div>
              )}
              {book.available === 0 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  Unavailable
                </div>
              )}
            </div>
            <div className="p-5">
              <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-2">{book.category}</span>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition">{book.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{book.author}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{book.available}/{book.totalCopies} copies</span>
                <span className="font-mono text-gray-300">ISBN: {book.isbn?.slice(0, 12)}...</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FiBook className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No books found matching your search.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl font-medium transition ${p === page ? 'bg-[#0c1d3d] text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link href="/books" className="text-amber-400 font-medium text-sm">Books</Link>
              <Link href="/announcements" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Announcements</Link>
              <Link href="/contact" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Contact</Link>
              <Link href="/login" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Login</Link>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>}>
        <BooksContent />
      </Suspense>
    </div>
  );
}
