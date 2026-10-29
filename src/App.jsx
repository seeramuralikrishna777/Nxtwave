// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-primary font-semibold"
        : "text-gray-600 hover:text-primary hover:bg-gray-100"
    }`;

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <span className="text-2xl" role="img" aria-label="rocket">🚀</span>
              <span>AI Sprint Growth Hub</span>
            </NavLink>
            <nav className="flex items-center space-x-1 sm:space-x-3">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          <p>© 2026 AI Project Sprint Growth Hub. Built for rapid student adoption & viral growth.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
