"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiUsers, FiBook, FiMessageSquare, FiBell, FiArrowLeft } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "books" | "messages" | "announcements">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers).catch(() => {});
    fetch("/api/books").then((r) => r.json()).then((d) => setBooks(d.books || [])).catch(() => {});
    fetch("/api/admin/messages").then((r) => r.json()).then(setMessages).catch(() => {});
    fetch("/api/announcements").then((r) => r.json()).then(setAnnouncements).catch(() => {});
  }, []);

  const tabs = [
    { key: "users" as const, label: "Users", icon: <FiUsers /> },
    { key: "books" as const, label: "Books", icon: <FiBook /> },
    { key: "messages" as const, label: "Messages", icon: <FiMessageSquare /> },
    { key: "announcements" as const, label: "Announcements", icon: <FiBell /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-900 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
                <FaBookOpen className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold hidden sm:block">Admin Dashboard</span>
            </div>
            <Link href="/" className="flex items-center gap-1 text-white/80 hover:text-white transition text-sm font-medium">
              <FiArrowLeft /> Back to Library
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-500 mb-8">Library management dashboard</p>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition ${
                tab === t.key ? "bg-[#0c1d3d] text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{u.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "books" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.slice(0, 20).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.author}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">{b.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{b.available}/{b.totalCopies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{m.subject}</h3>
                    <p className="text-sm text-gray-500">From: {m.name} ({m.email})</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: m.message }} />
              </div>
            ))}
          </div>
        )}

        {tab === "announcements" && (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900 mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-3">By {a.author}</p>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: a.content }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
