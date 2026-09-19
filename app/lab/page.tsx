"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiX, FiAlertTriangle, FiInfo, FiSearch, FiShield, FiClock, FiEdit3, FiTarget, FiFlag, FiBook, FiLock, FiGlobe, FiServer, FiDatabase, FiCode } from "react-icons/fi";
import { FaBookOpen, FaFlag, FaCheckCircle, FaExclamationTriangle, FaBug, FaShieldAlt, FaServer, FaDatabase, FaCode } from "react-icons/fa";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  hint: string;
  flag: string;
  points: number;
  order: number;
}

interface Evidence {
  id: number;
  title: string;
  endpoint: string;
  method: string;
  requestBody: string | null;
  responseBody: string | null;
  finding: string;
  severity: string;
  notes: string;
  createdAt: string;
}

interface Progress {
  id: number;
  challengeId: number;
  completed: boolean;
  completedAt: string | null;
  challenge: Challenge;
}

const difficultyConfig: Record<string, { color: string; bg: string; icon: any }> = {
  Easy: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: <FaShieldAlt /> },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: <FaBug /> },
  Hard: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: <FaExclamationTriangle /> },
};

const severityConfig: Record<string, { color: string; bg: string }> = {
  Low: { color: "text-blue-400", bg: "bg-blue-500/10" },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-500/10" },
  High: { color: "text-orange-400", bg: "bg-orange-500/10" },
  Critical: { color: "text-red-400", bg: "bg-red-500/10" },
};

const categoryIcons: Record<string, any> = {
  "Configuration Exposure": <FiServer />,
  "Client-Side Exposure": <FiCode />,
  "API Security": <FaServer />,
  "Access Control": <FiLock />,
  "XSS": <FiCode />,
  "Authentication": <FiShield />,
  "Security Misconfiguration": <FiGlobe />,
  "Information Disclosure": <FiDatabase />,
  "Assessment": <FaFlag />,
};

export default function LabPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [tab, setTab] = useState<"challenges" | "evidence" | "timeline" | "flag">("challenges");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [evidenceForm, setEvidenceForm] = useState({
    title: "", endpoint: "", method: "GET", requestBody: "", responseBody: "",
    finding: "", severity: "Medium", notes: "",
  });
  const [showHint, setShowHint] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<{ time: string; event: string; type: string }[]>([]);

  useEffect(() => {
    fetchChallenges();
    fetchProgress();
    fetchEvidence();
  }, []);

  async function fetchChallenges() {
    try {
      const res = await fetch("/api/lab/challenges");
      const data = await res.json();
      setChallenges(data);
    } catch {}
  }

  async function fetchProgress() {
    try {
      const res = await fetch("/api/lab/progress?userId=1");
      const data = await res.json();
      setProgress(data);
      generateTimeline(data);
    } catch {}
  }

  async function fetchEvidence() {
    try {
      const res = await fetch("/api/lab/evidence?userId=1");
      const data = await res.json();
      setEvidence(data);
    } catch {}
  }

  function generateTimeline(prog: Progress[]) {
    const events = prog
      .filter((p) => p.completed)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
      .map((p) => ({
        time: new Date(p.completedAt!).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        event: `Completed: ${p.challenge.title}`,
        type: "challenge",
      }));

    setTimeline([
      { time: "09:41", event: "Application discovered", type: "discovery" },
      { time: "09:44", event: "Security assessment started", type: "start" },
      ...events,
    ]);
  }

  async function submitFlag() {
    if (!selectedChallenge) return;
    try {
      const res = await fetch("/api/lab/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: selectedChallenge.id, flag: flagInput, userId: 1 }),
      });
      const data = await res.json();
      setFlagResult(data);
      if (data.correct) {
        fetchProgress();
        setFlagInput("");
      }
    } catch {
      setFlagResult({ correct: false, message: "Connection error" });
    }
  }

  async function submitEvidence() {
    try {
      const res = await fetch("/api/lab/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...evidenceForm, userId: 1 }),
      });
      if (res.ok) {
        fetchEvidence();
        setEvidenceForm({ title: "", endpoint: "", method: "GET", requestBody: "", responseBody: "", finding: "", severity: "Medium", notes: "" });
      }
    } catch {}
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const totalPoints = progress.filter((p) => p.completed).reduce((sum, p) => sum + p.challenge.points, 0);
  const maxPoints = challenges.reduce((sum, c) => sum + c.points, 0);

  const tabs = [
    { key: "challenges" as const, label: "Challenges", icon: <FiTarget /> },
    { key: "evidence" as const, label: "Evidence", icon: <FiSearch /> },
    { key: "timeline" as const, label: "Timeline", icon: <FiClock /> },
    { key: "flag" as const, label: "Submit Flag", icon: <FiFlag /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#080c18" }}>
      {/* Header */}
      <header className="border-b border-white/5" style={{ background: "#0d1220" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1">
              <FiArrowLeft /> Library
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.15)" }}>
                <FiShield className="text-red-500" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">
                  <span className="text-red-500">CARTHAGE</span> Security Lab
                </h1>
                <p className="text-gray-500 text-xs">Web Application Security Assessment</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Progress</div>
              <div className="text-sm font-mono text-white">
                {completedCount}/{challenges.length} <span className="text-gray-600">challenges</span>
              </div>
            </div>
            <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: "#1a1f2e" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(completedCount / Math.max(challenges.length, 1)) * 100}%`,
                  background: completedCount === challenges.length ? "#22c55e" : "#dc2626",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Points", value: `${totalPoints}/${maxPoints}`, icon: <FaFlag />, color: "#dc2626" },
            { label: "Challenges", value: `${completedCount}/${challenges.length}`, icon: <FiTarget />, color: "#3b82f6" },
            { label: "Evidence", value: evidence.length, icon: <FiSearch />, color: "#f59e0b" },
            { label: "Findings", value: evidence.filter((e) => e.severity === "High" || e.severity === "Critical").length, icon: <FiAlertTriangle />, color: "#f97316" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 border border-white/5" style={{ background: "#0d1220" }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-xl p-1 overflow-x-auto" style={{ background: "#0d1220" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                tab === t.key ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
              style={tab === t.key ? { background: "#dc2626" } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Challenges */}
        {tab === "challenges" && (
          <div className="space-y-3">
            {challenges.map((c) => {
              const completed = progress.some((p) => p.challengeId === c.id && p.completed);
              const diff = difficultyConfig[c.difficulty] || difficultyConfig.Medium;
              const catIcon = categoryIcons[c.category] || <FiInfo />;
              return (
                <div key={c.id}
                  className={`rounded-xl border border-white/5 p-5 cursor-pointer transition hover:border-white/10 ${
                    selectedChallenge?.id === c.id ? "ring-2 ring-red-500/30" : ""
                  }`}
                  style={{ background: completed ? "#0a1510" : "#0d1220" }}
                  onClick={() => { setSelectedChallenge(c); setTab("flag"); setFlagResult(null); }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600 font-mono text-sm w-8">#{String(c.order).padStart(2, "0")}</span>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${diff.bg} border ${diff.color}`}>
                        {catIcon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{c.title}</span>
                          {completed && <FaCheckCircle className="text-green-400 text-sm" />}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{c.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => { e.stopPropagation(); setShowHint(showHint === c.id ? null : c.id); }}
                        className="text-gray-600 hover:text-yellow-400 text-xs transition font-medium">
                        hint
                      </button>
                      <span className={`text-xs px-2.5 py-1 rounded-lg border ${diff.bg} ${diff.color} font-semibold`}>
                        {c.difficulty}
                      </span>
                      <span className="text-gray-400 text-sm font-mono">{c.points}pts</span>
                    </div>
                  </div>
                  {showHint === c.id && (
                    <div className="mt-4 p-4 rounded-lg text-sm text-yellow-300/80 border border-yellow-500/10" style={{ background: "rgba(234,179,8,0.05)" }}>
                      <FiInfo className="inline mr-2" />{c.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Flag Submission */}
        {tab === "flag" && (
          <div className="rounded-xl border border-white/5 p-8" style={{ background: "#0d1220" }}>
            {selectedChallenge ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${difficultyConfig[selectedChallenge.difficulty]?.bg} border ${difficultyConfig[selectedChallenge.difficulty]?.color}`}>
                    {categoryIcons[selectedChallenge.category] || <FiInfo />}
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">{selectedChallenge.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${difficultyConfig[selectedChallenge.difficulty]?.bg} ${difficultyConfig[selectedChallenge.difficulty]?.color} border font-semibold`}>
                        {selectedChallenge.difficulty}
                      </span>
                      <span className="text-gray-500 text-sm">{selectedChallenge.category}</span>
                      <span className="text-gray-400 text-sm font-mono">{selectedChallenge.points} points</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{selectedChallenge.description}</p>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-2 font-medium">Enter Flag</label>
                  <div className="flex gap-3">
                    <input type="text" value={flagInput} onChange={(e) => setFlagInput(e.target.value)}
                      placeholder="FLAG{...}"
                      className="flex-1 px-4 py-3.5 rounded-xl text-white font-mono text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition"
                      style={{ background: "#080c18" }} />
                    <button onClick={submitFlag}
                      className="px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90 flex items-center gap-2 shadow-lg shadow-red-500/20"
                      style={{ background: "#dc2626" }}>
                      <FiFlag /> Submit
                    </button>
                  </div>
                </div>
                {flagResult && (
                  <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
                    flagResult.correct ? "text-green-400 border-green-500/20" : "text-red-400 border-red-500/20"
                  }`} style={{ background: flagResult.correct ? "rgba(34,197,94,0.05)" : "rgba(220,38,38,0.05)" }}>
                    {flagResult.correct ? <FaCheckCircle /> : <FiX />}
                    {flagResult.correct ? " " : " "}{flagResult.message}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FiTarget className="text-5xl text-gray-700 mx-auto mb-4" />
                <p>Select a challenge from the Challenges tab to submit a flag.</p>
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {tab === "evidence" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 p-6" style={{ background: "#0d1220" }}>
              <h3 className="text-white font-bold mb-5 flex items-center gap-2"><FiEdit3 /> New Evidence Record</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Title</label>
                  <input type="text" value={evidenceForm.title} onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    style={{ background: "#080c18" }} placeholder="e.g., Public User API" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Endpoint</label>
                  <input type="text" value={evidenceForm.endpoint} onChange={(e) => setEvidenceForm({ ...evidenceForm, endpoint: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    style={{ background: "#080c18" }} placeholder="e.g., /api/users" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Method</label>
                  <select value={evidenceForm.method} onChange={(e) => setEvidenceForm({ ...evidenceForm, method: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    style={{ background: "#080c18" }}>
                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Severity</label>
                  <select value={evidenceForm.severity} onChange={(e) => setEvidenceForm({ ...evidenceForm, severity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    style={{ background: "#080c18" }}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Finding</label>
                  <textarea value={evidenceForm.finding} onChange={(e) => setEvidenceForm({ ...evidenceForm, finding: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                    style={{ background: "#080c18" }} rows={2} placeholder="Describe the vulnerability..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Notes</label>
                  <textarea value={evidenceForm.notes} onChange={(e) => setEvidenceForm({ ...evidenceForm, notes: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                    style={{ background: "#080c18" }} rows={2} placeholder="Additional notes..." />
                </div>
                <div className="col-span-2">
                  <button onClick={submitEvidence}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm flex items-center gap-2 shadow-lg shadow-red-500/20"
                    style={{ background: "#dc2626" }}>
                    <FiEdit3 /> Save Evidence
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {evidence.map((e) => {
                const sev = severityConfig[e.severity] || severityConfig.Medium;
                return (
                  <div key={e.id} className="rounded-xl border border-white/5 p-5" style={{ background: "#0d1220" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-mono text-xs">#{String(e.id).padStart(3, "0")}</span>
                        <span className="text-white font-medium">{e.title}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${sev.bg} ${sev.color}`}>{e.severity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className="px-2 py-0.5 rounded font-mono text-amber-400" style={{ background: "rgba(245,158,11,0.1)" }}>{e.method}</span>
                      <span className="font-mono text-gray-400">{e.endpoint}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{e.finding}</p>
                    {e.notes && <p className="text-gray-600 text-xs mt-2">{e.notes}</p>}
                  </div>
                );
              })}
              {evidence.length === 0 && (
                <div className="text-center py-12 text-gray-600" style={{ background: "#0d1220" }}>
                  <FiSearch className="text-4xl text-gray-700 mx-auto mb-3" />
                  <p>No evidence recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {tab === "timeline" && (
          <div className="rounded-xl border border-white/5 p-8" style={{ background: "#0d1220" }}>
            <h3 className="text-white font-bold mb-8 flex items-center gap-2"><FiClock /> Investigation Timeline</h3>
            <div className="space-y-0">
              {timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full" style={{
                      background: event.type === "challenge" ? "#22c55e" : event.type === "discovery" ? "#3b82f6" : event.type === "start" ? "#dc2626" : "#6b7280",
                    }} />
                    {i < timeline.length - 1 && <div className="w-px h-8" style={{ background: "#1a1f2e" }} />}
                  </div>
                  <div className="pb-6">
                    <div className="text-xs font-mono text-gray-500">{event.time}</div>
                    <div className="text-white text-sm">{event.event}</div>
                  </div>
                </div>
              ))}
              {timeline.length <= 2 && (
                <div className="text-gray-600 text-sm py-4 ml-7">Complete challenges to see your investigation timeline.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
