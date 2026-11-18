"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Process", "/process"],
  ["Why us", "/why-us"],
  ["Contact", "/contact"],
] as const;

const themes = [
  { id: "mocha", colors: ["#1A110C", "#E6C888", "#C4601A"], label: "Mocha" },
  {
    id: "charcoal",
    colors: ["#131518", "#C7D0DA", "#E4312B"],
    label: "Charcoal",
  },
  { id: "beige", colors: ["#F2E8D8", "#1C4FD6", "#F6B800"], label: "Beige" },
  { id: "lemon", colors: ["#101010", "#F0E442", "#9B7BFF"], label: "Lemon" },
] as const;

function applyTheme(id: string) {
  if (id === "mocha") document.documentElement.removeAttribute("data-palette");
  else document.documentElement.setAttribute("data-palette", id);
  try {
    window.localStorage.setItem("iw-palette", id);
  } catch {
    // Theme changes still work for this visit when storage is unavailable.
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("mocha");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    try {
      const saved = window.localStorage.getItem("iw-palette");
      if (saved && themes.some((item) => item.id === saved)) {
        frame = window.requestAnimationFrame(() => setTheme(saved));
      }
    } catch {
      // The initial theme remains usable if browser storage is disabled.
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function chooseTheme(id: string) {
    setTheme(id);
    applyTheme(id);
  }

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link
          className="brand"
          href="/"
          aria-label="Infinite Wires home"
          onClick={() => setMenuOpen(false)}
        >
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="5" fill="#F7C61B" />
            <circle cx="32" cy="28" r="21" fill="#B3262B" />
            <circle
              cx="32"
              cy="28"
              r="15"
              fill="none"
              stroke="#F7C61B"
              strokeWidth="2.6"
            />
            <circle cx="32" cy="28" r="9" fill="#F7C61B" />
            <circle cx="32" cy="28" r="5" fill="#B3262B" />
            <path
              d="M13 40C26 38 38 20 51 15"
              fill="none"
              stroke="#F7C61B"
              strokeWidth="2.2"
            />
            <text
              x="32"
              y="58.5"
              textAnchor="middle"
              fontSize="7.6"
              fontWeight="700"
              fill="#B3262B"
              fontFamily="Instrument Sans,Arial,sans-serif"
              letterSpacing=".5"
            >
              INFINITE
            </text>
          </svg>
          <span>
            <b>Infinite Wires</b>
            <small>&amp; Components Pvt. Ltd.</small>
          </span>
        </Link>

        <nav
          className={`main-nav${menuOpen ? " open" : ""}`}
          id="site-navigation"
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <Link
              aria-current={pathname === href ? "page" : undefined}
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <div className="palette" role="group" aria-label="Colour theme">
            {themes.map((item) => (
              <button
                aria-label={`${item.label} theme`}
                aria-pressed={theme === item.id}
                className="swatch"
                key={item.id}
                onClick={() => chooseTheme(item.id)}
                style={{
                  background: `conic-gradient(${item.colors[0]} 0 33.3%,${item.colors[1]} 0 66.6%,${item.colors[2]} 0)`,
                }}
                title={item.label}
                type="button"
              />
            ))}
          </div>
          <button
            ref={menuButtonRef}
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
