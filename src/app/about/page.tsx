import Link from "next/link";
import { CtaBand, Eyebrow, PageIntro } from "@/components/shared";
import { WireCrossSection } from "@/components/wire-art";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Infinite Wires & Components, manufacturing submersible copper winding wire since 2008.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About us"
        title={
          <>
            Making winding wire <em>since 2008</em>.
          </>
        }
        description="Infinite Wires and Components Pvt. Ltd. manufactures submersible copper winding wire for pump motors of all sizes."
      />
      <section className="section">
        <div className="wrap split">
          <div className="prose" data-reveal>
            <p>
              We began in 2008 with one product and one aim: winding wire that
              makes the winder&apos;s work easier. Since then our skilled team
              has refined a single thing above all, a finish that stays{" "}
              <b>soft and smooth at any size</b>.
            </p>
            <p>
              We use only <b>100% pure EC grade copper</b> from Birla Sterlite.
              Every length has one solid copper conductor and a white outer
              coating, made to the copper diameter and overall diameter you
              specify.
            </p>
            <p>
              Because the wire is soft, it is easy to mould. Labour on the
              winding line can lay it into pump motors quickly and cleanly,
              which is why pump makers and rewinders come back to us.
            </p>
            <Link className="text-link" href="/products">
              Explore our wire <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="about-visual" data-reveal>
            <span className="visual-index">01 / MATERIAL</span>
            <WireCrossSection />
          </div>
        </div>
      </section>
      <section className="band section">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <Eyebrow>What we stand for</Eyebrow>
            <h2>
              Three things we <em>never</em> compromise.
            </h2>
          </div>
          <div className="reason-grid three">
            <article className="reason-card" data-reveal>
              <span className="card-kicker">Material</span>
              <h3>Pure copper</h3>
              <p>100% EC grade copper from Birla Sterlite, never blended.</p>
            </article>
            <article className="reason-card" data-reveal>
              <span className="card-kicker">Finish</span>
              <h3>Soft and smooth</h3>
              <p>
                The same gentle, even finish on thin wire and thick wire alike.
              </p>
            </article>
            <article className="reason-card" data-reveal>
              <span className="card-kicker">Size</span>
              <h3>Made to your size</h3>
              <p>Copper OD and overall OD set by you, not by a catalogue.</p>
            </article>
          </div>
        </div>
      </section>
      <CtaBand
        title={
          <>
            Let&apos;s make your <em>next batch</em>.
          </>
        }
      >
        Share the sizes you need and we will take it from there.
      </CtaBand>
    </>
  );
}
