"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  [
    "Material",
    "Select the copper",
    "Only 100% pure EC grade copper from Birla Sterlite enters the line.",
  ],
  [
    "Your copper OD",
    "Draw to size",
    "The copper is drawn to the copper diameter you specified, whatever radius your pump design calls for.",
  ],
  [
    "Your overall OD",
    "Apply the white coating",
    "The white outer coating goes on to your overall diameter, evenly around the single conductor.",
  ],
  [
    "Our speciality",
    "Finish soft and smooth",
    "Our skilled team brings every size to the same soft, smooth finish, so the wire moulds easily.",
  ],
  [
    "Quality",
    "Inspect",
    "Finish and dimensions are checked against the sizes on your order.",
  ],
  [
    "Delivery",
    "Spool and dispatch",
    "The finished wire is packed and sent to your winding room, ready to use.",
  ],
];

export function ProcessTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = timeline.getBoundingClientRect();
        const value = (window.innerHeight * 0.6 - bounds.top) / bounds.height;
        setProgress(Math.max(0, Math.min(1, value)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="timeline"
      ref={timelineRef}
      style={{ "--timeline-progress": progress } as React.CSSProperties}
    >
      {stages.map(([tag, title, description], index) => (
        <article
          className={`timeline-step${progress * stages.length > index ? " reached" : ""}`}
          data-reveal
          key={title}
        >
          <span className="step-number">{index + 1}</span>
          <span className="step-tag">{tag}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}
