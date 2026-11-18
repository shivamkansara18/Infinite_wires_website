import { BendDemo } from "@/components/bend-demo";
import { CtaBand, Eyebrow, PageIntro } from "@/components/shared";

export const metadata = {
  title: "Why Choose Us",
  description:
    "Discover the material, finish, custom sizing, and manufacturing experience behind our submersible winding wire.",
  alternates: { canonical: "/why-us" },
};

export default function WhyUsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Why choose us"
        title={
          <>
            The wire your winders will <em>prefer</em>.
          </>
        }
        description="Pure copper and made-to-size are only part of it. The real difference is how the wire behaves in the hands of the people who use it."
      />
      <section className="section">
        <div className="wrap reason-grid why-grid">
          <article className="reason-card reason-feature" data-reveal>
            <span className="card-kicker">Our speciality</span>
            <h2>Soft and smooth, whatever the size</h2>
            <p>
              Thin or thick, our wire has the same gentle, even finish. It
              moulds easily and helps your labour lay it into pumps quickly and
              cleanly.
            </p>
          </article>
          <article className="reason-card" data-reveal>
            <span className="card-kicker">Material</span>
            <h3>100% EC grade copper</h3>
            <p>From Birla Sterlite. One solid conductor in every length.</p>
          </article>
          <article className="reason-card" data-reveal>
            <span className="card-kicker">Sizes</span>
            <h3>Your OD, your radius</h3>
            <p>Copper OD and overall OD are both set to your requirement.</p>
          </article>
          <article className="reason-card" data-reveal>
            <span className="card-kicker">Experience</span>
            <h3>Since 2008</h3>
            <p>
              Years of making one product, and a skilled team that knows it
              well.
            </p>
          </article>
          <article className="reason-card" data-reveal>
            <span className="card-kicker">Range</span>
            <h3>Pumps of all sizes</h3>
            <p>For submersible motors, from small to large.</p>
          </article>
        </div>
      </section>
      <section className="band section">
        <div className="wrap split">
          <div className="section-heading" data-reveal>
            <Eyebrow>Feel the difference</Eyebrow>
            <h2>
              Bend it. <em>It follows.</em>
            </h2>
            <p className="lead">
              Move over the wire or use the slider. The curve stays smooth all
              the way along, which is what makes it easy to work with.
            </p>
          </div>
          <BendDemo />
        </div>
      </section>
      <CtaBand
        title={
          <>
            Try a <em>trial</em> order.
          </>
        }
      >
        Tell us your sizes and see the finish for yourself.
      </CtaBand>
    </>
  );
}
