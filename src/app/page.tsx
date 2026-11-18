import Link from "next/link";
import { BendDemo } from "@/components/bend-demo";
import { CtaBand, Eyebrow } from "@/components/shared";
import {
  CopperWireCoil,
  MotorStator,
  WireCrossSection,
} from "@/components/wire-art";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const years = new Date().getFullYear() - 2008;
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow>Submersible copper winding wire</Eyebrow>
            <h1>
              Pure copper,
              <br />
              <em>softly</em> sheathed.
            </h1>
            <p className="lead">
              Single-conductor copper winding wire for submersible pump motors
              of every size. Made from 100% pure EC grade copper, to the exact
              copper and overall diameter you ask for, with a finish that is
              soft, smooth and easy on the winder&apos;s hands.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/products">
                Explore the wire
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Request a size
              </Link>
            </div>
            <p className="hero-note">
              <span className="note-line" />
              Made to your copper OD and overall OD
            </p>
          </div>
          <CopperWireCoil />
        </div>
      </section>

      <div className="marquee" aria-label="Company highlights">
        <div className="marquee-track">
          {Array.from({ length: 2 }, (_, repeat) => (
            <span
              className="marquee-set"
              key={repeat}
              aria-hidden={repeat === 1}
            >
              {[
                "Submersible winding wire",
                "100% EC grade copper",
                "Soft, smooth finish",
                "Custom copper and overall OD",
                "Since 2008",
                "Copper from Birla Sterlite",
                "For pumps of every size",
              ].map((item) => (
                <span key={item}>
                  {item}
                  <i>✳</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section
        className="wrap stats-section"
        aria-label="Company facts"
        data-reveal
      >
        <div className="stat">
          <b aria-label={String(years)}>
            <span className="stat-count" aria-hidden="true" data-count-up={years}>
              {years}
            </span>
          </b>
          <span>Years making winding wire</span>
        </div>
        <div className="stat">
          <b aria-label="100%">
            <span className="stat-count" aria-hidden="true">
              <span data-count-up={100}>100</span>%
            </span>
          </b>
          <span>Pure EC grade copper</span>
        </div>
        <div className="stat">
          <b>Custom</b>
          <span>Copper and overall OD</span>
        </div>
        <div className="stat">
          <b>All</b>
          <span>Submersible pump sizes</span>
        </div>
      </section>

      <section className="band section">
        <div className="wrap split">
          <div className="anatomy-art" data-reveal>
            <WireCrossSection />
          </div>
          <div data-reveal>
            <div className="section-heading">
              <Eyebrow>Anatomy of the wire</Eyebrow>
              <h2>
                One conductor. <em>Nothing</em> else inside.
              </h2>
              <p className="lead">
                This is winding wire, not a cable. Every length carries a single
                solid copper conductor under a white outer coating. No strands
                and no multiple cores.
              </p>
            </div>
            <ol className="key-list">
              <li>
                <span>1</span>
                <div>
                  <h3>White outer coating</h3>
                  <p>
                    Applied to the overall diameter you specify, evenly all the
                    way round.
                  </p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>Single solid copper conductor</h3>
                  <p>
                    100% pure EC grade copper from Birla Sterlite, drawn to your
                    copper diameter.
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>Soft, smooth finish</h3>
                  <p>
                    Our speciality at every size. The wire moulds easily by
                    hand.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <div className="section-heading">
              <Eyebrow>The feel of it</Eyebrow>
              <h2>
                Soft enough to shape. <em>Smooth</em> enough to slide.
              </h2>
              <p className="lead">
                Skilled hands on the winding line notice the difference straight
                away. Our wire moulds easily and runs smoothly into the slots,
                whatever the size.
              </p>
            </div>
            <p className="note">
              <b>Try it.</b> Move your cursor over the wire, drag the slider, or
              tap it on a phone.
            </p>
          </div>
          <BendDemo />
        </div>
      </section>

      <section className="band section">
        <div className="wrap split">
          <div className="stator-wrap" data-reveal>
            <MotorStator />
          </div>
          <div data-reveal>
            <div className="section-heading">
              <Eyebrow>Where it goes</Eyebrow>
              <h2>
                Wound into every submersible <em>motor</em>.
              </h2>
              <p className="lead">
                Inside a submersible pump motor, winding wire is laid into the
                stator slots turn after turn. Each small circle here is one
                length of our wire in cross-section: white coating around a
                single copper core.
              </p>
            </div>
            <div className="legend">
              <span>
                <i className="coating-swatch" />
                Coating
              </span>
              <span>
                <i className="copper-swatch" />
                Copper
              </span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Send us your sizes. <em>We make the wire.</em>
          </>
        }
        secondLabel="Preview a size"
        secondHref="/products"
      >
        Tell us the copper OD and the overall OD for your pump and we will
        manufacture to it.
      </CtaBand>
    </>
  );
}
