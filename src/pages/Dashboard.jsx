// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getRegistrations,
  getLeaderboard,
  getRegistrationsBySource,
  getRegistrationsByDay,
  getDemoDataFlag,
  setDemoDataFlag,
  clearAllData,
} from "../utils/storage";

// Demo dataset for initial preview and presentation
const DEMO_REGISTRATIONS = [
  {
    name: "Alice Patel",
    email: "alice@example.com",
    college: "IIT Bombay",
    branch: "CSE",
    gradYear: "2025",
    source: "College Clubs",
    referralCode: "ALICE1",
    usedReferral: null,
    timestamp: "2026-10-23T10:00:00.000Z",
  },
  {
    name: "Bob Kumar",
    email: "bob@example.com",
    college: "BITS Pilani",
    branch: "IT",
    gradYear: "2025",
    source: "Peer Referrals",
    referralCode: "BOB456",
    usedReferral: "ALICE1",
    timestamp: "2026-10-24T12:30:00.000Z",
  },
  {
    name: "Cara Singh",
    email: "cara@example.com",
    college: "VIT Vellore",
    branch: "AI/ML",
    gradYear: "2026",
    source: "WhatsApp Groups",
    referralCode: "CARA78",
    usedReferral: "ALICE1",
    timestamp: "2026-10-25T14:45:00.000Z",
  },
  {
    name: "Dinesh Rao",
    email: "dinesh@example.com",
    college: "NIT Trichy",
    branch: "CSE",
    gradYear: "2025",
    source: "Paid Promotion",
    referralCode: "DIN901",
    usedReferral: null,
    timestamp: "2026-10-26T09:15:00.000Z",
  },
  {
    name: "Esha Verma",
    email: "esha@example.com",
    college: "DTU Delhi",
    branch: "IT",
    gradYear: "2025",
    source: "Peer Referrals",
    referralCode: "ESH234",
    usedReferral: "BOB456",
    timestamp: "2026-10-27T16:20:00.000Z",
  },
];

const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [demoLoaded, setDemoLoaded] = useState(false);

  const refreshData = () => {
    const regs = getRegistrations();
    setRegistrations(regs);
    setLeaderboard(getLeaderboard());

    const srcMap = getRegistrationsBySource();
    setSourceData(Object.entries(srcMap).map(([name, value]) => ({ name, value })));
    setDayData(getRegistrationsByDay());
    setDemoLoaded(getDemoDataFlag());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const loadDemoData = () => {
    const existing = getRegistrations();
    const existingEmails = new Set(existing.map(r => r.email.toLowerCase()));
    const newDemoRecords = DEMO_REGISTRATIONS.filter(
      r => !existingEmails.has(r.email.toLowerCase())
    );
    const combined = [...existing, ...newDemoRecords];
    localStorage.setItem("registrations", JSON.stringify(combined));
    setDemoDataFlag(true);
    refreshData();
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all registrations and referral data?")) {
      clearAllData();
      refreshData();
    }
  };

  const total = registrations.length;
  const target = 500;
  const percent = target ? Math.min(100, Math.round((total / target) * 100)) : 0;
  const referralCount = registrations.filter(r => r.usedReferral).length;
  const budget = 2000; // INR
  const spent = Math.min(budget, Math.round((total / target) * budget));
  const remaining = Math.max(0, budget - spent);
  const cpr = total > 0 ? (spent / total).toFixed(2) : "0.00";

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Growth Analytics Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time tracking of signups, referral virality, and acquisition metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!demoLoaded && (
            <button
              onClick={loadDemoData}
              className="bg-primary hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition"
            >
              + Load Demo Dataset
            </button>
          )}
          {(demoLoaded || total > 0) && (
            <button
              onClick={clearData}
              className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 text-sm font-medium px-4 py-2 rounded-xl transition"
            >
              Clear All Data
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Signups</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Target Goal</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{target}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Achieved</p>
          <p className="text-2xl font-bold text-primary mt-1">{percent}%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Via Referrals</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{referralCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Spent (₹)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{spent}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining (₹)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{remaining}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cost / Signup</p>
          <p className="text-2xl font-bold text-accent mt-1">₹{cpr}</p>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center text-sm font-medium mb-2">
          <span className="text-gray-700">Sprint Goal Progress ({total} / {target} students)</span>
          <span className="text-primary font-bold">{percent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registrations by Day */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-80">
          <h2 className="text-base font-bold text-gray-800 mb-3">Registrations by Day</h2>
          <div className="flex-1 w-full min-h-0">
            {dayData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <span>No registrations recorded yet</span>
                <span className="text-xs text-gray-400 mt-1">Click "Load Demo Dataset" above to preview</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Registrations by Source */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-80">
          <h2 className="text-base font-bold text-gray-800 mb-3">Registrations by Channel</h2>
          <div className="flex-1 w-full min-h-0">
            {sourceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <span>No acquisition channel data yet</span>
                <span className="text-xs text-gray-400 mt-1">Click "Load Demo Dataset" above to preview</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {sourceData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Top Referrers Leaderboard */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Referral Leaderboard</h2>
            <p className="text-xs text-gray-500">Top advocates driving peer registrations</p>
          </div>
          <span className="text-xs font-semibold bg-blue-50 text-primary px-3 py-1 rounded-full border border-blue-100">
            {leaderboard.length} Referrers
          </span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No referral conversions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-16">Rank</th>
                  <th className="px-6 py-3">Advocate Name</th>
                  <th className="px-6 py-3">Referral Code</th>
                  <th className="px-6 py-3 text-right">Successful Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.map((item, idx) => (
                  <tr key={item.code} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-3 font-semibold text-gray-700">
                      {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-primary">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Registered Participants</h2>
            <p className="text-xs text-gray-500">Live roster of student signups</p>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {total} Total
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No registrations yet. Register via the Register page to see your entry appear here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">College & Branch</th>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Referral Code</th>
                  <th className="px-6 py-3 text-right">Invited By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...registrations].reverse().map((reg, idx) => (
                  <tr key={`${reg.email}-${idx}`} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{reg.name}</p>
                      <p className="text-xs text-gray-400">{reg.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {reg.college} <span className="text-gray-400">({reg.branch})</span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{reg.gradYear}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {reg.source}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                        {reg.referralCode}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {reg.usedReferral ? (
                        <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                          {reg.usedReferral}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
