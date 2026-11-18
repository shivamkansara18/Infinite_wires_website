"use client";

import Link from "next/link";
import { useState } from "react";
import { coatingThickness, copperAreaPercentage, presets } from "@/lib/product";

function fmt(value: number) {
  return value.toFixed(2);
}

export function SizeConfigurator() {
  const [copper, setCopper] = useState(1.6);
  const [overall, setOverall] = useState(2.6);
  const copperRadius = (copper / 5) * 180;
  const outerRadius = (overall / 5) * 180;
  const enquiryUrl = `/contact?copperOD=${fmt(copper)}&overallOD=${fmt(overall)}`;

  function updateCopper(value: number) {
    setCopper(value);
    if (value >= overall - 0.05) setOverall(Math.min(5, value + 0.05));
  }

  function updateOverall(value: number) {
    setOverall(Math.max(value, copper + 0.05));
  }

  return (
    <div className="configurator" data-reveal>
      <div className="config-preview">
        <svg
          viewBox="0 0 440 440"
          role="img"
          aria-label={`Wire cross-section preview: copper ${fmt(copper)} millimetres, overall ${fmt(overall)} millimetres`}
        >
          <defs>
            <radialGradient id="preview-sheath" cx=".35" cy=".3" r=".85">
              <stop stopColor="#fff" />
              <stop offset=".65" stopColor="#eeeae2" />
              <stop offset="1" stopColor="#c9c4b9" />
            </radialGradient>
            <radialGradient id="preview-copper" cx=".35" cy=".3" r=".85">
              <stop stopColor="#ffd9a6" />
              <stop offset=".45" stopColor="#e49a55" />
              <stop offset="1" stopColor="#7a3a14" />
            </radialGradient>
          </defs>
          <circle
            cx="220"
            cy="220"
            r={outerRadius}
            className="preview-disc"
            fill="url(#preview-sheath)"
          />
          <circle
            cx="220"
            cy="220"
            r={copperRadius + 7}
            className="preview-disc"
            fill="#000"
            opacity=".18"
          />
          <circle
            cx="220"
            cy="220"
            r={copperRadius}
            className="preview-disc"
            fill="url(#preview-copper)"
          />
          <line
            x1="40"
            x2="400"
            y1="220"
            y2="220"
            className="dimension-copper preview-diameter"
            style={{ transform: `scaleX(${copperRadius / 180})` }}
          />
          <line
            x1="40"
            x2="400"
            y1="220"
            y2="220"
            className="dimension-overall preview-diameter"
            style={{
              transform: `translateY(${outerRadius + 18}px) scaleX(${outerRadius / 180})`,
            }}
          />
        </svg>
      </div>
      <div className="config-controls">
        <div className="control-row">
          <label htmlFor="copper-size">
            <span>
              <i className="key-swatch copper-swatch" />
              Copper OD
            </span>
            <output>{fmt(copper)} mm</output>
          </label>
          <input
            id="copper-size"
            type="range"
            min="0.5"
            max="4"
            step="0.05"
            value={copper}
            onChange={(event) => updateCopper(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>0.50 mm</span>
            <span>4.00 mm</span>
          </div>
        </div>
        <div className="control-row">
          <label htmlFor="overall-size">
            <span>
              <i className="key-swatch coating-swatch" />
              Overall OD
            </span>
            <output>{fmt(overall)} mm</output>
          </label>
          <input
            id="overall-size"
            type="range"
            min="0.6"
            max="5"
            step="0.05"
            value={overall}
            onChange={(event) => updateOverall(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>0.60 mm</span>
            <span>5.00 mm</span>
          </div>
        </div>
        <div className="readouts" aria-live="polite">
          <div>
            <span>Coating, each side</span>
            <b>{fmt(coatingThickness(copper, overall))} mm</b>
          </div>
          <div>
            <span>Copper share of area</span>
            <b>{Math.round(copperAreaPercentage(copper, overall))}%</b>
          </div>
        </div>
        <div className="presets">
          <span className="mono">Samples</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              className="link-button"
              type="button"
              onClick={() => {
                setCopper(preset.copper);
                setOverall(preset.overall);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="config-note">
          Preview only. We manufacture to the exact sizes you send us.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href={enquiryUrl}>
            Request this size
          </Link>
        </div>
      </div>
    </div>
  );
}
