"use client";

import { useEffect, useRef } from "react";

export function CopperWireCoil() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = stage.getBoundingClientRect();
      stage.style.setProperty(
        "--px",
        `${((event.clientX - bounds.left) / bounds.width - 0.5) * 24}px`,
      );
      stage.style.setProperty(
        "--py",
        `${((event.clientY - bounds.top) / bounds.height - 0.5) * 18}px`,
      );
    };
    const reset = () => {
      stage.style.setProperty("--px", "0px");
      stage.style.setProperty("--py", "0px");
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", reset);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div
      className="coil-stage"
      ref={stageRef}
      aria-label="Illustration of white-coated copper winding wire"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <svg
        className="coil-art"
        viewBox="0 0 700 540"
        role="img"
        aria-labelledby="coil-title"
      >
        <title id="coil-title">
          A coil of white-coated copper winding wire with exposed copper ends
        </title>
        <defs>
          <linearGradient id="wire-sheath" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#cfcac0" />
          </linearGradient>
          <linearGradient id="wire-copper" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#ffd9a6" />
            <stop offset=".55" stopColor="#d88543" />
            <stop offset="1" stopColor="#71350f" />
          </linearGradient>
          <linearGradient id="wire-tube" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#d3cec4" />
          </linearGradient>
          <filter
            id="coil-shadow"
            filterUnits="userSpaceOnUse"
            x="-100"
            y="-100"
            width="1200"
            height="900"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g className="coil-rings" fill="none">
          <circle
            cx="350"
            cy="270"
            r="205"
            style={{ "--i": 0 } as React.CSSProperties}
          />
          <circle
            cx="350"
            cy="270"
            r="245"
            style={{ "--i": 1 } as React.CSSProperties}
          />
          <circle
            cx="350"
            cy="270"
            r="285"
            style={{ "--i": 2 } as React.CSSProperties}
          />
        </g>
        <ellipse
          cx="310"
          cy="410"
          rx="240"
          ry="48"
          fill="#000"
          opacity=".34"
          filter="url(#coil-shadow)"
        />
        <g className="coil-loops">
          {Array.from({ length: 8 }, (_, index) => {
            const loopIndex = 7 - index;
            const cy = 215 + loopIndex * 15;
            return (
              <g
                className="coil-loop"
                key={loopIndex}
                style={{ animationDelay: `${index * 90 + 200}ms` }}
              >
                <ellipse
                  cx="300"
                  cy={cy + 8}
                  rx="175"
                  ry="70"
                  fill="none"
                  stroke="#000"
                  strokeOpacity=".22"
                  strokeWidth="30"
                />
                <ellipse
                  cx="300"
                  cy={cy}
                  rx="175"
                  ry="70"
                  fill="none"
                  stroke="url(#wire-tube)"
                  strokeWidth="26"
                />
                <ellipse
                  cx="300"
                  cy={cy - 5}
                  rx="172"
                  ry="66"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".5"
                  strokeWidth="4"
                />
              </g>
            );
          })}
        </g>
        <g className="copper-ends">
          <path
            d="M572 399 640 346"
            fill="none"
            stroke="#8a4418"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M572 399 640 346"
            fill="none"
            stroke="#e39a55"
            strokeLinecap="round"
            strokeWidth="9"
          />
          <path
            d="m574 396 64-51"
            fill="none"
            stroke="#ffd9a6"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </g>
        <g className="coil-tail">
          <path
            pathLength="1"
            d="M125 215C40 262 70 420 250 455C380 480 520 450 590 385"
            fill="none"
            stroke="#000"
            strokeOpacity=".25"
            strokeWidth="30"
            transform="translate(0 12)"
          />
          <path
            pathLength="1"
            d="M125 215C40 262 70 420 250 455C380 480 520 450 590 385"
            fill="none"
            stroke="#bdb8ad"
            strokeWidth="30"
          />
          <path
            pathLength="1"
            d="M125 215C40 262 70 420 250 455C380 480 520 450 590 385"
            fill="none"
            stroke="#f5f3ee"
            strokeWidth="26"
          />
          <path
            pathLength="1"
            d="M125 215C40 262 70 420 250 455C380 480 520 450 590 385"
            fill="none"
            stroke="#fff"
            strokeOpacity=".85"
            strokeWidth="6"
            transform="translate(0 -5)"
          />
        </g>
        <path
          d="m640 322 5 19 19 5-19 5-5 19-5-19-19-5 19-5z"
          fill="#ffe9c7"
          className="sparkle"
        />
      </svg>
      <div className="chip chip-one">
        <i />
        100% EC grade copper
      </div>
      <div className="chip chip-two">
        <i />
        Soft · smooth · easy to mould
      </div>
    </div>
  );
}

export function WireCrossSection({
  className = "",
  copperRadius = 90,
  outerRadius = 175,
}: {
  className?: string;
  copperRadius?: number;
  outerRadius?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 420"
      role="img"
      aria-label="Cross-section of a single solid copper conductor under a white outer coating"
    >
      <defs>
        <radialGradient id="section-sheath" cx=".35" cy=".3" r=".85">
          <stop stopColor="#fff" />
          <stop offset=".65" stopColor="#eeeae2" />
          <stop offset="1" stopColor="#c9c4b9" />
        </radialGradient>
        <radialGradient id="section-copper" cx=".35" cy=".3" r=".85">
          <stop stopColor="#ffd9a6" />
          <stop offset=".45" stopColor="#e49a55" />
          <stop offset="1" stopColor="#7a3a14" />
        </radialGradient>
        <filter id="section-shadow">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g className="section-spin">
        <circle
          cx="210"
          cy="210"
          r="200"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="2 11"
          strokeLinecap="round"
        />
      </g>
      <circle
        cx="210"
        cy="222"
        r={outerRadius + 1}
        fill="#000"
        opacity=".3"
        filter="url(#section-shadow)"
      />
      <circle cx="210" cy="210" r={outerRadius} fill="url(#section-sheath)" />
      <circle
        cx="210"
        cy="210"
        r={outerRadius - 35}
        fill="none"
        stroke="#c9c4ba"
        strokeOpacity=".5"
        strokeWidth="1.5"
      />
      <circle
        cx="210"
        cy="210"
        r={copperRadius + 8}
        fill="#000"
        opacity=".22"
      />
      <circle cx="210" cy="210" r={copperRadius} fill="url(#section-copper)" />
      <circle
        cx="210"
        cy="210"
        r={copperRadius * 0.76}
        fill="none"
        stroke="#fff"
        strokeOpacity=".14"
        strokeWidth="1.5"
      />
      <circle
        cx="210"
        cy="210"
        r={copperRadius * 0.49}
        fill="none"
        stroke="#fff"
        strokeOpacity=".12"
        strokeWidth="1.5"
      />
      <path
        d="M150 168A78 78 0 0 1 206 135"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="5"
        opacity=".65"
      />
      <circle cx="295" cy="109" r="15" className="pin" />
      <text x="295" y="115" className="pin-text">
        1
      </text>
      <circle cx="172" cy="196" r="15" className="pin" />
      <text x="172" y="202" className="pin-text">
        2
      </text>
      <circle cx="344" cy="322" r="15" className="pin" />
      <text x="344" y="328" className="pin-text">
        3
      </text>
    </svg>
  );
}

export function MotorStator() {
  return (
    <svg
      className="stator-art"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Cross-section of a submersible pump motor stator and winding slots"
    >
      <circle cx="200" cy="200" r="188" className="stator-body" />
      {Array.from({ length: 18 }, (_, slot) => (
        <g key={slot} transform={`translate(200 200) rotate(${slot * 20})`}>
          <rect
            x="-18"
            y="-152"
            width="36"
            height="64"
            rx="5"
            className="stator-slot"
          />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 3 }, (_, column) => {
              const x = -11 + column * 11;
              const y = -146 + row * 12;
              return (
                <g key={`${row}-${column}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5.2"
                    fill="#f2efe9"
                    stroke="#c9c4ba"
                    strokeWidth=".6"
                  />
                  <circle cx={x} cy={y} r="2.7" fill="url(#section-copper)" />
                </g>
              );
            }),
          )}
          <rect
            x="-18"
            y="-152"
            width="36"
            height="64"
            rx="5"
            className="stator-glow"
            style={{ "--i": slot } as React.CSSProperties}
          />
        </g>
      ))}
      <circle cx="200" cy="200" r="84" className="stator-bore" />
      <g className="stator-rotor">
        <circle cx="200" cy="200" r="64" className="stator-core" />
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index * Math.PI) / 3;
          return (
            <line
              key={index}
              x1="200"
              y1="200"
              x2={200 + 58 * Math.cos(angle)}
              y2={200 + 58 * Math.sin(angle)}
              className="stator-spoke"
            />
          );
        })}
        <circle cx="200" cy="200" r="15" className="stator-shaft" />
      </g>
    </svg>
  );
}
