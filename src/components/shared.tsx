import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="wrap page-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </div>
  );
}

export function CtaBand({
  title,
  children,
  secondLabel,
  secondHref,
}: {
  title: React.ReactNode;
  children: string;
  secondLabel?: string;
  secondHref?: string;
}) {
  return (
    <section className="cta-band">
      <div className="wrap" data-reveal>
        <Eyebrow>Made to order</Eyebrow>
        <h2>{title}</h2>
        <p>{children}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contact">
            Send an enquiry
          </Link>
          {secondLabel && secondHref && (
            <Link className="btn btn-ghost" href={secondHref}>
              {secondLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
