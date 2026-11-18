import Link from "next/link";
import { company } from "@/config/company";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="brand" href="/">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="5" fill="#F7C61B" />
              <circle cx="32" cy="28" r="21" fill="#B3262B" />
              <circle
                cx="32"
                cy="28"
                r="15"
                fill="none"
                stroke="#F7C61B"
                strokeWidth="2.6"
              />
              <circle cx="32" cy="28" r="9" fill="#F7C61B" />
              <circle cx="32" cy="28" r="5" fill="#B3262B" />
              <path
                d="M13 40C26 38 38 20 51 15"
                fill="none"
                stroke="#F7C61B"
                strokeWidth="2.2"
              />
              <text
                x="32"
                y="58.5"
                textAnchor="middle"
                fontSize="7.6"
                fontWeight="700"
                fill="#B3262B"
                fontFamily="Instrument Sans,Arial,sans-serif"
                letterSpacing=".5"
              >
                INFINITE
              </text>
            </svg>
            <span>
              <b>Infinite Wires</b>
              <small>&amp; Components Pvt. Ltd.</small>
            </span>
          </Link>
          <p>{company.description}</p>
        </div>
        <div>
          <h2>Pages</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/process">Process</Link>
            </li>
            <li>
              <Link href="/why-us">Why us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Talk to us</h2>
          <ul>
            <li>
              <Link href="/contact">Send an enquiry</Link>
            </li>
            <li>
              <Link href="/products">Preview a size</Link>
            </li>
            {company.contact.email && (
              <li>
                <a href={`mailto:${company.contact.email}`}>
                  {company.contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="wrap legal">
        © {new Date().getFullYear()} {company.name}
      </div>
    </footer>
  );
}
