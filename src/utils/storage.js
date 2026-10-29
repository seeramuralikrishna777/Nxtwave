// src/utils/storage.js
// Utility functions for handling registrations and referral data in localStorage

const REG_KEY = "registrations";
const DEMO_KEY = "demoDataLoaded";

export function getRegistrations() {
  try {
    const data = localStorage.getItem(REG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading registrations:", e);
    return [];
  }
}

export function saveRegistration(reg) {
  try {
    const regs = getRegistrations();
    regs.push(reg);
    localStorage.setItem(REG_KEY, JSON.stringify(regs));
  } catch (e) {
    console.error("Error saving registration:", e);
  }
}

export function isEmailRegistered(email) {
  if (!email) return false;
  const regs = getRegistrations();
  return regs.some(r => r.email && r.email.toLowerCase() === email.trim().toLowerCase());
}

export function generateReferralCode() {
  // Simple 6-character alphanumeric code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure uniqueness
  const regs = getRegistrations();
  if (regs.some(r => r.referralCode === code)) return generateReferralCode();
  return code;
}

export function getReferralStats() {
  const regs = getRegistrations();
  const stats = {};
  regs.forEach(r => {
    const ref = r.usedReferral;
    if (ref && ref !== r.referralCode) {
      stats[ref] = (stats[ref] || 0) + 1;
    }
  });
  return stats;
}

export function getLeaderboard() {
  const stats = getReferralStats();
  const regs = getRegistrations();
  const list = Object.entries(stats).map(([code, count]) => {
    const owner = regs.find(r => r.referralCode === code);
    return {
      code,
      name: owner ? owner.name : "Unknown",
      count,
    };
  });
  list.sort((a, b) => b.count - a.count);
  return list;
}

export function getRegistrationsBySource() {
  const regs = getRegistrations();
  const map = {};
  regs.forEach(r => {
    const src = r.source || "Other";
    map[src] = (map[src] || 0) + 1;
  });
  return map;
}

export function getRegistrationsByDay() {
  const regs = getRegistrations();
  const map = {};
  regs.forEach(r => {
    if (!r.timestamp) return;
    try {
      const date = new Date(r.timestamp).toISOString().split("T")[0];
      map[date] = (map[date] || 0) + 1;
    } catch {
      // Ignore invalid date strings
    }
  });
  // Convert to array sorted by date
  return Object.entries(map)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getDemoDataFlag() {
  return localStorage.getItem(DEMO_KEY) === "true";
}

export function setDemoDataFlag(value) {
  localStorage.setItem(DEMO_KEY, value ? "true" : "false");
}

export function clearAllData() {
  localStorage.removeItem(REG_KEY);
  localStorage.removeItem(DEMO_KEY);
}
