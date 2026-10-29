// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  isEmailRegistered,
  generateReferralCode,
  saveRegistration,
} from "../utils/storage";

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const referralFromQuery = query.get("ref");

  // Check query parameter or saved referral from previous visit
  const effectiveReferral = referralFromQuery || sessionStorage.getItem("referralRef") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    gradYear: "",
    source: effectiveReferral ? "Peer Referrals" : "",
    referral: effectiveReferral,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [myReferral, setMyReferral] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (referralFromQuery) {
      sessionStorage.setItem("referralRef", referralFromQuery);
    }
  }, [referralFromQuery]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      newErrors.email = "Please enter a valid email address";
    if (!form.college.trim()) newErrors.college = "College name is required";
    if (!form.branch.trim()) newErrors.branch = "Engineering branch is required";
    if (!form.gradYear.toString().trim()) newErrors.gradYear = "Graduation year is required";
    if (!form.source) newErrors.source = "Please select how you heard about us";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    const emailNorm = form.email.trim().toLowerCase();
    if (isEmailRegistered(emailNorm)) {
      setErrors({ email: "This email address is already registered!" });
      return;
    }

    const myCode = generateReferralCode();
    const usedRef = form.referral && form.referral.trim().toUpperCase() !== myCode
      ? form.referral.trim().toUpperCase()
      : null;

    const registration = {
      name: form.name.trim(),
      email: emailNorm,
      college: form.college.trim(),
      branch: form.branch.trim(),
      gradYear: form.gradYear.toString().trim(),
      source: form.source,
      referralCode: myCode,
      usedReferral: usedRef,
      timestamp: new Date().toISOString(),
    };

    saveRegistration(registration);
    setMyReferral(myCode);
    setSubmitted(true);
  };

  const getShareUrl = () => {
    return `${window.location.origin}?ref=${myReferral}`;
  };

  const copyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareViaWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(
      `🚀 Join me at the Free 60-Minute "Build Your First AI Project" Workshop! Build a portfolio-ready AI project. Register using my invite link:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleNativeShare = () => {
    const url = getShareUrl();
    if (navigator.share) {
      navigator.share({
        title: "Free AI Project Sprint Workshop",
        text: "Join me at the Free 60-Minute AI Project Sprint Workshop! Register with my invite link:",
        url: url,
      }).catch(() => {});
    } else {
      copyLink();
    }
  };

  if (submitted) {
    return (
      <section className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Welcome aboard, <strong>{form.name}</strong>! Your seat has been reserved.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Your Unique Referral Code
              </span>
              <span className="text-xs text-blue-600 font-medium">Earn leaderboard perks</span>
            </div>
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-blue-200">
              <span className="font-mono text-2xl font-bold tracking-wider text-primary">
                {myReferral}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Share your link with batchmates & friends. Every student who registers with your link boosts your rank on the live leaderboard!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyLink}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 border ${
                copied
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {copied ? "✓ Link Copied!" : "📋 Copy Referral Link"}
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-sm text-white bg-green-600 hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <span>💬</span> Share on WhatsApp
            </button>

            {typeof navigator !== "undefined" && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-xl font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                title="Share"
              >
                ↗ More
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition"
            >
              View Live Dashboard →
            </Link>
            <button
              onClick={() => {
                setForm({
                  name: "",
                  email: "",
                  college: "",
                  branch: "",
                  gradYear: "",
                  source: "",
                  referral: "",
                });
                setSubmitted(false);
              }}
              className="inline-flex items-center justify-center text-gray-600 hover:text-gray-900 font-medium py-2.5 px-4 rounded-xl text-sm transition"
            >
              + Register Another Student
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Limited Free Seats
          </span>
          <h1 className="text-3xl font-bold text-gray-900">Register for Free</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Reserve your spot for the 60-Minute AI Project Sprint Workshop.
          </p>
        </div>

        {effectiveReferral && (
          <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-sm text-blue-900">
            <span>
              Applying Referral Code: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-blue-300">{effectiveReferral}</strong>
            </span>
            <span className="text-green-700 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded-full">✓ Verified</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. rahul@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                College / University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="college"
                placeholder="e.g. IIT Bombay / VIT"
                value={form.college}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.college ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.college && <p className="text-red-600 text-xs mt-1">{errors.college}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Engineering Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="branch"
                placeholder="e.g. CSE, IT, AI/ML, ECE"
                value={form.branch}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.branch ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.branch && <p className="text-red-600 text-xs mt-1">{errors.branch}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Graduation Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="gradYear"
                placeholder="e.g. 2025"
                min="2020"
                max="2035"
                value={form.gradYear}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.gradYear ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.gradYear && <p className="text-red-600 text-xs mt-1">{errors.gradYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                How did you hear about us? <span className="text-red-500">*</span>
              </label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.source ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select source</option>
                <option value="College Clubs">College Clubs</option>
                <option value="WhatsApp Groups">WhatsApp Groups</option>
                <option value="Peer Referrals">Peer Referrals</option>
                <option value="Paid Promotion">Paid Promotion</option>
                <option value="Other">Other</option>
              </select>
              {errors.source && <p className="text-red-600 text-xs mt-1">{errors.source}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="referral"
              placeholder="e.g. ABC123"
              value={form.referral}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 mt-2"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
