import React, { useEffect, useMemo, useState, Suspense } from "react";
import { Routes, Route, NavLink, Outlet } from "react-router-dom";


const AppShell = React.lazy(() => import("./AppShell.jsx"));

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { STR, isRTL } from "./lib/i18n.js";
import Footer from "./components/Footer.jsx";

/** Small reusable controls */
function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      className="btn--ghost"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-pressed={isDark}
      title={label}
      aria-label={label}
    >
      {isDark ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}

// NOTE: no label text; styled like a ghost button
function LanguageSelect({ language, setLanguage }) {
  return (
    <select
      className="select--ghost"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Language"
      title="Language"
    >
      <option value="English">English</option>
      <option value="Dari">Dari</option>
      <option value="Pashto">Pashto</option>
    </select>
  );
}

function Navbar({ language, setLanguage, theme, setTheme }) {
  return (
    <nav
      className="card"
      aria-label="Main"
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <NavLink to="/" end>Home</NavLink>

      {/* Prefetch the AppShell chunk on hover */}
      <NavLink to="/app" onMouseEnter={() => import("./AppShell.jsx")}>
        Main
      </NavLink>

      <NavLink to="/about">About</NavLink>

      {/* controls */}
      <div style={{ marginInlineStart: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <LanguageSelect language={language} setLanguage={setLanguage} />
      </div>
    </nav>
  );
}

function RootLayout() {
  // Global language (persist)
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "English");
  const T = STR[language];

  // Global theme (persist + system default)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply dir/lang
  useEffect(() => {
    const dir = isRTL(language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang =
      language === "English" ? "en" : language === "Dari" ? "fa" : "ps";
    localStorage.setItem("language", language);
  }, [language]);

  // Provide globals to children
  const outletCtx = useMemo(
    () => ({ language, setLanguage, theme, setTheme, T }),
    [language, theme, T]
  );

  return (
    <div className="container" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      {/* page content */}
      <div style={{ flex: 1 }}>
        {/* Re-mount pages when language changes so text updates immediately */}
        <Outlet context={outletCtx} key={language} />
      </div>

      {/* footer on every page */}
      <Footer
        appName="Planora"
        author="Your Name"
        github="https://github.com/yourusername"
        linkedin="https://www.linkedin.com/in/yourusername"
        whatsapp="https://wa.me/1234567890"
        portfolio="https://your-portfolio.example"
      />
    </div>
  );
}

export default function App() {
  // NOTE: Do NOT put <BrowserRouter> here. It's in src/main.jsx.
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route
          path="/app"
          element={
            <Suspense fallback={<div className="card">Loading app…</div>}>
              <AppShell />
            </Suspense>
          }
        />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
