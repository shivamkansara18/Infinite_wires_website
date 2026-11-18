"use client";

import { useEffect, useRef, useState } from "react";

export function BendDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const manualRef = useRef<number | null>(null);
  const flowingRef = useRef(true);
  const paintRef = useRef<(amount: number) => void>(() => {});
  const [manual, setManual] = useState(0);
  const [flowing, setFlowing] = useState(true);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-wire-layer]"),
    );
    const copperPaths = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-copper-side]"),
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let current = reduced ? 40 : 0;
    let time = Math.random() * 6;
    let pointerY = 150;
    let hovering = false;
    let burst = 0;
    let burstUntil = 0;

    const paint = (amount: number) => {
      const x0 = 110;
      const x1 = 690;
      const y = 150;
      const bend = Math.round(amount * 100) / 100;
      const d = `M ${x0} ${y} C ${x0 + 170} ${y + bend}, ${x1 - 170} ${y - bend}, ${x1} ${y}`;
      paths.forEach((path) => path.setAttribute("d", d));

      const length = Math.hypot(170, bend);
      const ux = 170 / length;
      const uy = bend / length;
      const left = `M ${x0 + 14 * ux} ${y + 14 * uy} L ${x0 - 62 * ux} ${y - 62 * uy}`;
      const right = `M ${x1 - 14 * ux} ${y - 14 * uy} L ${x1 + 62 * ux} ${y + 62 * uy}`;
      copperPaths.forEach((path) => {
        path.setAttribute(
          "d",
          path.dataset.copperSide === "left" ? left : right,
        );
      });
    };
    paintRef.current = paint;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = svg.getBoundingClientRect();
      pointerY = ((event.clientY - bounds.top) / bounds.height) * 280;
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = true;
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = false;
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      burst = (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 40);
      burstUntil = performance.now() + 1400;
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerenter", onEnter);
    svg.addEventListener("pointerleave", onLeave);
    svg.addEventListener("pointerdown", onDown);

    const animate = (now: number) => {
      let target = current;
      if (now < burstUntil) {
        target = burst;
      } else if (hovering) {
        target = Math.max(-110, Math.min(110, (pointerY - 150) * 0.95));
      } else if (manualRef.current !== null) {
        target = manualRef.current * 1.1;
      } else if (flowingRef.current) {
        time += 0.012;
        target = 78 * Math.sin(time);
      }
      current += (target - current) * 0.1;
      paint(current);
      if (!reduced) frame = window.requestAnimationFrame(animate);
    };

    paint(current);
    if (!reduced) frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      paintRef.current = () => {};
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerenter", onEnter);
      svg.removeEventListener("pointerleave", onLeave);
      svg.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="bend-box" data-reveal>
      <svg
        ref={svgRef}
        viewBox="0 0 800 280"
        role="img"
        aria-label="Interactive illustration of soft winding wire bending smoothly"
      >
        <defs>
          <filter id="bend-shadow" x="-10%" y="-30%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path
          data-wire-layer
          d="M 110 150 C 280 150, 520 150, 690 150"
          fill="none"
          stroke="#000"
          strokeOpacity=".28"
          strokeWidth="34"
          strokeLinecap="round"
          transform="translate(0 16)"
          filter="url(#bend-shadow)"
        />
        <path
          data-wire-layer
          d="M 110 150 C 280 150, 520 150, 690 150"
          fill="none"
          stroke="#bdb8ad"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path
          data-wire-layer
          d="M 110 150 C 280 150, 520 150, 690 150"
          fill="none"
          stroke="#f5f3ee"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          data-wire-layer
          d="M 110 150 C 280 150, 520 150, 690 150"
          fill="none"
          stroke="#fff"
          strokeOpacity=".8"
          strokeWidth="6"
          strokeLinecap="round"
          transform="translate(0 -5)"
        />
        {(["left", "right"] as const).map((side) => (
          <g key={side}>
            <path
              data-copper-side={side}
              d={side === "left" ? "M 124 150 L 48 150" : "M 676 150 L 752 150"}
              fill="none"
              stroke="#8a4418"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              data-copper-side={side}
              d={side === "left" ? "M 124 150 L 48 150" : "M 676 150 L 752 150"}
              fill="none"
              stroke="#e39a55"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
      <div className="bend-controls">
        <label htmlFor="bend-control">
          Bend{" "}
          <input
            id="bend-control"
            type="range"
            min="-100"
            max="100"
            value={manual}
            onChange={(event) => {
              const value = Number(event.target.value);
              manualRef.current = value;
              flowingRef.current = false;
              setManual(value);
              setFlowing(false);
              if (
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                paintRef.current(value * 1.1);
              }
            }}
          />
        </label>
        <button
          className="link-button"
          type="button"
          onClick={() => {
            const nextFlowing = !flowing;
            flowingRef.current = nextFlowing;
            manualRef.current = null;
            setManual(0);
            setFlowing(nextFlowing);
          }}
        >
          {flowing ? "Pause" : "Let it flow"}
        </button>
        <button
          className="link-button"
          type="button"
          onClick={() => {
            manualRef.current = 0;
            flowingRef.current = false;
            setManual(0);
            setFlowing(false);
            paintRef.current(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
