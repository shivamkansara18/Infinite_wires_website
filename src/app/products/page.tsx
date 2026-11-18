import { SizeConfigurator } from "@/components/size-configurator";
import { CtaBand, Eyebrow, PageIntro } from "@/components/shared";

export const metadata = {
  title: "Products",
  description:
    "Configure submersible copper winding wire dimensions and preview the solid copper conductor and white coating.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title={
          <>
            Submersible copper <em>winding wire</em>.
          </>
        }
        description="One conductor, one white coating, made in the sizes your pump needs. Slide the two diameters below to preview the cross-section."
      />
      <section
        className="wrap configurator-section"
        aria-label="Wire size configurator"
        data-reveal
      >
        <SizeConfigurator />
      </section>
      <section className="band section">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <Eyebrow>What goes in</Eyebrow>
            <h2>
              Two materials. <em>Nothing</em> else.
            </h2>
          </div>
          <div className="material-grid">
            <article className="material-card" data-reveal>
              <svg
                viewBox="0 0 400 120"
                role="img"
                aria-label="Illustration of solid copper rod"
              >
                <defs>
                  <linearGradient id="rod-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#ffe0b5" />
                    <stop offset=".5" stopColor="#b8642a" />
                    <stop offset="1" stopColor="#6f3410" />
                  </linearGradient>
                  <linearGradient id="rod-shine-gradient">
                    <stop stopColor="#fff" stopOpacity="0" />
                    <stop offset=".5" stopColor="#fff" stopOpacity=".5" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="rod-shine-clip">
                    <rect x="10" y="30" width="380" height="60" rx="30" />
                  </clipPath>
                </defs>
                <rect
                  x="10"
                  y="30"
                  width="380"
                  height="60"
                  rx="30"
                  fill="url(#rod-gradient)"
                />
                <path
                  d="M60 38v44"
                  stroke="#fff"
                  strokeWidth="7"
                  opacity=".25"
                />
                <g className="material-shine" clipPath="url(#rod-shine-clip)">
                  <rect
                    x="-140"
                    y="0"
                    width="70"
                    height="120"
                    fill="url(#rod-shine-gradient)"
                  />
                </g>
              </svg>
              <h3>100% pure EC grade copper</h3>
              <p>
                Sourced from Birla Sterlite and drawn to the copper diameter you
                specify. This is the single conductor at the heart of every
                length.
              </p>
            </article>
            <article className="material-card" data-reveal>
              <svg
                viewBox="0 0 400 120"
                role="img"
                aria-label="Illustration of white-coated wire with copper conductor"
              >
                <defs>
                  <linearGradient id="wire-shine-gradient">
                    <stop stopColor="#fff" stopOpacity="0" />
                    <stop offset=".5" stopColor="#fff" stopOpacity=".5" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="wire-shine-clip">
                    <rect x="10" y="22" width="270" height="76" rx="8" />
                    <rect x="260" y="44" width="130" height="32" rx="16" />
                  </clipPath>
                </defs>
                <rect
                  x="10"
                  y="22"
                  width="270"
                  height="76"
                  rx="8"
                  fill="#eeeae2"
                />
                <rect
                  x="260"
                  y="44"
                  width="130"
                  height="32"
                  rx="16"
                  fill="url(#rod-gradient)"
                />
                <line
                  x1="280"
                  y1="14"
                  x2="280"
                  y2="106"
                  stroke="var(--accent)"
                  strokeDasharray="4 4"
                />
                <g className="material-shine" clipPath="url(#wire-shine-clip)">
                  <rect
                    x="-140"
                    y="0"
                    width="70"
                    height="120"
                    fill="url(#wire-shine-gradient)"
                  />
                </g>
              </svg>
              <h3>White outer coating</h3>
              <p>
                Applied evenly to the overall diameter you ask for, with a soft,
                smooth finish that is easy to mould and easy to wind.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <Eyebrow>At a glance</Eyebrow>
            <h2>
              The <em>details</em>.
            </h2>
          </div>
          <dl className="spec-list" data-reveal>
            <div>
              <dt>Product</dt>
              <dd>Submersible copper winding wire</dd>
            </div>
            <div>
              <dt>Conductor</dt>
              <dd>Single solid copper conductor, 100% pure EC grade</dd>
            </div>
            <div>
              <dt>Copper source</dt>
              <dd>Birla Sterlite</dd>
            </div>
            <div>
              <dt>Coating</dt>
              <dd>White outer coating</dd>
            </div>
            <div>
              <dt>Sizes</dt>
              <dd>Custom copper OD and overall OD, made to your requirement</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>Soft, smooth and easily moulded at every size</dd>
            </div>
            <div>
              <dt>Used in</dt>
              <dd>Submersible pump motors of all sizes</dd>
            </div>
            <div>
              <dt>Making it since</dt>
              <dd>2008</dd>
            </div>
          </dl>
        </div>
      </section>
      <CtaBand
        title={
          <>
            Got a size in <em>mind</em>?
          </>
        }
      >
        Send the copper OD and overall OD and we will get back to you.
      </CtaBand>
    </>
  );
}
