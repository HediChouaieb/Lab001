"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogOut, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser } from "react-icons/fi";
import { FaBookOpen, FaIdCard } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(stored);

    fetch(`/api/users/me?userId=${userData.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(userData);
        setLoading(false);
      });
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dob = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("fr-FR") : "N/A";
  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "2026";

  const fields = [
    { icon: <FiMail />, label: "Email", value: user.email },
    { icon: <FiPhone />, label: "Phone", value: user.phone || "+216 XX XXX XXX" },
    { icon: <FiCalendar />, label: "Date of Birth", value: dob },
    { icon: <FiMapPin />, label: "Address", value: user.address || "N/A" },
  ];

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
              <Link href="/dashboard" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Dashboard</Link>
              <Link href="/profile" className="text-amber-400 font-medium text-sm">Profile</Link>
              <Link href="/books" className="text-white/90 hover:text-amber-400 transition font-medium text-sm">Books</Link>
              <button onClick={() => { localStorage.clear(); router.push("/"); }} className="flex items-center gap-1 text-white/90 hover:text-red-400 transition font-medium text-sm">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0c1d3d] to-[#132b5e] p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <FiUser className="text-4xl text-white/80" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-white/60">Member since {joined}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {fields.map((field, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="text-amber-500">{field.icon}</span> {field.label}
                  </div>
                  <div className="font-medium text-gray-900">{field.value}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0c1d3d] rounded-xl flex items-center justify-center">
                  <FaIdCard className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Library Card Number</div>
                  <div className="text-xl font-bold text-[#0c1d3d]">
                    {user.libraryCard?.cardNumber || `CAR-2026-${String(user.id + 1000).padStart(4, "0")}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
