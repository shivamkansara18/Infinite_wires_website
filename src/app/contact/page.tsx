import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/shared";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send an enquiry about custom submersible copper winding wire sizes and quantities.",
};

function ContactDetails() {
  const rows = [
    ["Phone", company.contact.phone],
    ["Email", company.contact.email],
    ["Address", company.contact.address],
    ["Working hours", company.contact.hours],
  ].filter(([, value]) => value);

  return (
    <div>
      {rows.length > 0 && (
        <dl className="contact-details">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <h2>What to send us</h2>
      <ul className="check-list">
        <li>Copper OD you need</li>
        <li>Overall OD you need</li>
        <li>Quantity required</li>
        <li>The pump or motor it is for</li>
      </ul>
      {rows.length === 0 && (
        <p className="contact-note">
          Use the form to send your enquiry directly to our team.
        </p>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            Tell us the <em>size</em> you need.
          </>
        }
        description="Fill in the form to send your enquiry directly to our team. Include the dimensions, quantity, and pump or motor details you have."
      />
      <section className="section contact-section">
        <div className="wrap contact-grid">
          <div data-reveal>
            <ContactDetails />
          </div>
          <Suspense
            fallback={<div className="form-loading">Loading enquiry form…</div>}
          >
            <div data-reveal>
              <ContactForm />
            </div>
          </Suspense>
        </div>
      </section>
    </>
  );
}
