"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogOut, FiBook, FiCalendar, FiAlertTriangle, FiCheck, FiClock, FiMail, FiPhone } from "react-icons/fi";
import { FaBookOpen, FaIdCard, FaBookReader, FaCheckCircle } from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(stored);
    setUser(userData);

    fetch(`/api/users/me?userId=${userData.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrowings(data.borrowings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeBorrowings = borrowings.filter((b) => b.status === "BORROWED");
  const overdueBorrowings = borrowings.filter((b) => b.status === "OVERDUE");
  const returnedBorrowings = borrowings.filter((b) => b.status === "RETURNED");

  function getBorrowingStatus(b: any) {
    if (b.status === "RETURNED") return { label: "Returned", color: "bg-green-100 text-green-700", icon: <FiCheck className="inline mr-1" /> };
    if (b.status === "OVERDUE") return { label: "Overdue", color: "bg-red-100 text-red-700", icon: <FiAlertTriangle className="inline mr-1" /> };
    const due = new Date(b.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 7) return { label: "Due Soon", color: "bg-yellow-100 text-yellow-700", icon: <FiClock className="inline mr-1" /> };
    return { label: "Active", color: "bg-green-100 text-green-700", icon: <FiCheck className="inline mr-1" /> };
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
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-amber-400 font-medium text-sm">Dashboard</Link>
              <Link href="/profile" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Profile</Link>
              <Link href="/books" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Books</Link>
              <button onClick={() => { localStorage.clear(); router.push("/"); }} className="flex items-center gap-1 text-white/90 hover:text-red-400 transition font-medium text-sm">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.firstName}!</h1>
          <p className="text-gray-500 mt-1">Your library dashboard overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaIdCard className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Library Card</div>
                <div className="text-lg font-bold text-[#0c1d3d]">
                  {user.libraryCard?.cardNumber || `CAR-2026-${String(user.id + 1000).padStart(4, "0")}`}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {user.libraryCard?.status || "Active"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <FaBookReader className="text-amber-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Books Borrowed</div>
                <div className="text-lg font-bold text-[#0c1d3d]">{activeBorrowings.length + overdueBorrowings.length}</div>
                <div className="text-xs text-gray-400">Currently active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Account Status</div>
                <div className="text-lg font-bold text-green-600">Good Standing</div>
                <div className="text-xs text-gray-400">{returnedBorrowings.length} books returned</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Current Borrowings</h2>
          {borrowings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiBook className="text-4xl mx-auto mb-3 text-gray-300" />
              <p>No books currently borrowed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowings.map((b) => {
                const status = getBorrowingStatus(b);
                return (
                  <div key={b.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-[#0c1d3d] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiBook className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">{b.book.title}</div>
                      <div className="text-sm text-gray-500">{b.book.author}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FiCalendar className="text-xs" />
                        Due: {new Date(b.dueDate).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
