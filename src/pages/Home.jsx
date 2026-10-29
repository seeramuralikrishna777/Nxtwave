// src/pages/Home.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const refFromQuery = searchParams.get("ref");

  useEffect(() => {
    if (refFromQuery) {
      sessionStorage.setItem("referralRef", refFromQuery);
    }
  }, [refFromQuery]);

  const activeRef = refFromQuery || sessionStorage.getItem("referralRef");
  const registerLink = activeRef ? `/register?ref=${encodeURIComponent(activeRef)}` : "/register";

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      {activeRef && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-center text-sm font-medium shadow-sm">
          🎉 Special invitation! You were invited with referral code: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-300">{activeRef}</span>
        </div>
      )}

      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full">
          <span>●</span> Free 60-Minute Online Workshop
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Build Your First AI Project in <span className="text-primary">60 Minutes</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
          Stop just learning theoretical AI. Start shipping practical, portfolio-ready AI applications today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            to={registerLink}
            className="inline-flex items-center justify-center bg-primary hover:bg-blue-600 text-white font-semibold text-lg px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            Register for Free →
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-lg px-6 py-3.5 rounded-xl transition duration-200"
          >
            View Live Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Beginner-Friendly</h3>
            <p className="text-gray-600 text-sm">
              No complex math or deep AI experience required. We guide you step-by-step from zero to launch.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Practical Experience</h3>
            <p className="text-gray-600 text-sm">
              Build a real, interactive AI project using modern APIs and open-source developer tooling.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Portfolio Ready</h3>
            <p className="text-gray-600 text-sm">
              Walk away with a deployed artifact and GitHub repository you can proudly showcase on your resume.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-6 max-w-2xl mx-auto text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">🎯 Who is this for?</p>
          <p>Final-year engineering and CS students (CSE, IT, AI/ML, ECE) looking to accelerate practical skills and stand out to top tech recruiters.</p>
          <p className="mt-2 text-xs text-gray-500">Workshop schedule, live session link, and prerequisites will be shared via email upon registration.</p>
        </div>
      </div>

      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <details className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition" open>
            <summary className="font-semibold text-gray-800 cursor-pointer select-none">
              Do I need any prior AI knowledge?
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              No prior AI knowledge is necessary! Basic knowledge of web or programming concepts is helpful, but the session is fully guided and designed for beginners.
            </p>
          </details>

          <details className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition">
            <summary className="font-semibold text-gray-800 cursor-pointer select-none">
              Is the workshop completely free?
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Yes, 100% free! You will also get access to your own referral link after registration to invite fellow batchmates and climb the growth leaderboard.
            </p>
          </details>

          <details className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition">
            <summary className="font-semibold text-gray-800 cursor-pointer select-none">
              How will I join the live session?
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Once you submit your registration, your workshop joining link and calendar invite will be emailed to you before the session starts.
            </p>
          </details>
        </div>
      </section>
    </section>
  );
}

export default Home;
