# Infinite Wires & Components

A responsive Next.js website for Infinite Wires & Components Pvt. Ltd., built from the supplied `Infinite Wires & Components.html` design reference. The site presents the company's submersible copper winding wire and sends customer enquiries directly to the configured company email using Resend.

**This project intentionally has no database, admin dashboard, account system, checkout, or payment processing.** Enquiry delivery is email-based; the website does not retain a recoverable copy of submitted enquiries.

## Technology

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS 4 with custom CSS design tokens and components
- React Hook Form and Zod for enquiry form validation
- Next.js Route Handler and Resend for server-side enquiry delivery
- Vitest, React Testing Library, and Playwright test setup

## Features

- Six pages: Home, About, Products, Process, Why Choose Us, and Contact
- Four persistent themes: Mocha, Charcoal, Beige, and Lemon
- Responsive navigation, product configurator, custom SVG art, animations, and reduced-motion support
- Product dimensions and preview calculations:
  - Copper OD: 0.50–4.00 mm in 0.05 mm increments
  - Overall OD: 0.60–5.00 mm in 0.05 mm increments
  - Coating thickness per side: `(overall OD - copper OD) / 2`
  - Copper area percentage: `(copper OD / overall OD)² × 100`
- A contact form with client/server validation, a honeypot, a per-instance rate limiter, duplicate request suppression, and a copy-enquiry option
- Search metadata, canonical URLs, organization structured data, sitemap, and robots rules

## Requirements and local setup

Use Node.js 20.9 or later and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Public pages work without email credentials. To actually submit email enquiries, configure the Resend variables below.

## Set up enquiry emails

Website enquiries go to **infinitewires@gmail.com**. Resend sends them from a domain you control. Have access to that domain's DNS settings before starting.

### 1. Add and verify a sending domain

1. Sign in to the [Resend Domains dashboard](https://resend.com/domains) and select **Add Domain**.
2. Enter your domain or a sending subdomain. For example, if you own `yourcompany.com`, you can use `mail.yourcompany.com`.
3. Open the DNS settings at your domain provider. Add each DNS record Resend lists for sending, copying its type, host, and value. Keep the default TTL unless Resend specifies a value.
4. Return to Resend, start verification, and wait for the domain to show **Verified**.

### 2. Create a sending API key

1. Open the [Resend API Keys dashboard](https://resend.com/api-keys) and select **Create API Key**.
2. Name it `Infinite Wires website enquiries`, choose **Sending access**, and select your verified domain.
3. Copy the key beginning with `re_`. Store it in your local environment file and your hosting platform's secret settings. Keep it out of Git and browser-facing variables.

### 3. Configure the local website

From the project folder, open the local settings file:

```bash
nano .env.local
```

Update the existing entries with your real key and sender address:

```dotenv
RESEND_API_KEY=re_replace_with_your_actual_key
EMAIL_FROM=enquiries@mail.yourcompany.com
COMPANY_ENQUIRY_EMAIL=infinitewires@gmail.com
```

Use an `EMAIL_FROM` address on the exact domain you verified. If you verified `yourcompany.com`, use an address such as `enquiries@yourcompany.com`. Save with **Ctrl+O**, press **Enter**, and exit with **Ctrl+X**.

Stop any running dev server with **Ctrl+C**, then start it again with `npm run dev`.

### 4. Confirm local delivery

1. Open [the local contact page](http://localhost:3000/contact).
2. Submit an enquiry using `Website Test` as the name, an email address you control, and a short message.
3. In **infinitewires@gmail.com**, look for **Website enquiry — Website Test**. Check Spam if needed.
4. Open the message and click **Reply**. The draft should be addressed to the email you entered in the form.
5. If the form reports acceptance and the message is missing, look up its delivery status under **Emails** in Resend.

### 5. Configure and test the live website

In your hosting dashboard, open the project's **Environment Variables** or **Secrets** settings. Add `RESEND_API_KEY`, `EMAIL_FROM`, and `COMPANY_ENQUIRY_EMAIL` to the **Production** environment. Save and redeploy. Submit a test from the live Contact page and confirm it reaches Gmail.

Optional public contact details can be set separately with `NEXT_PUBLIC_COMPANY_PHONE`, `NEXT_PUBLIC_COMPANY_EMAIL`, `NEXT_PUBLIC_COMPANY_ADDRESS`, and `NEXT_PUBLIC_COMPANY_HOURS`.

## Email flow and delivery limits

The contact form submits to `POST /api/enquiry`. The route validates the data again, rejects the honeypot, applies a maximum of four requests per hour per detected client key, sends an HTML and plain-text message through Resend, and returns success only after Resend accepts the message.

For production on Vercel, optional persistent rate limiting is available through Upstash Redis:

1. Create a Redis database in the Upstash console and copy its REST URL and token.
2. Set both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local` and in the Vercel project's environment variables.
3. Restart the local server or redeploy. The route will use a shared four-per-hour sliding-window limit and shared two-minute duplicate-submit keys. If only one of the two variables is configured, requests fail closed with a safe error instead of silently falling back.

The Upstash integration stores only rate-limit counters and short-lived idempotency keys; it never stores enquiry contents. Client identifiers are hashed before being used as Redis keys. If the two Upstash variables are absent, local development uses an in-memory limiter. That fallback is per-process and **not globally reliable across Vercel serverless instances or restarts**.

Because enquiries are not stored in a database or queue, provider downtime, misconfiguration, spam filtering, or email delivery failures may mean an enquiry cannot be recovered through this website. The form displays an error and retry guidance; check Resend delivery logs and configure provider/domain monitoring for production.

## Tests and checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

API tests mock Resend and never send a real email. Playwright tests mock the enquiry endpoint when testing form success and failure. To install browsers for Playwright when needed:

```bash
npx playwright install
```

## Production build

```bash
npm run build
npm run start
```

## Vercel deployment

1. Push this project to a GitHub repository.
2. Import that repository into Vercel and keep the detected Next.js build settings.
3. Set `RESEND_API_KEY`, `COMPANY_ENQUIRY_EMAIL`, `EMAIL_FROM`, and `NEXT_PUBLIC_SITE_URL` in the Vercel project's environment variables. For shared production rate limiting, also set both Upstash Redis variables. Add any public company contact variables only if those details should be displayed.
4. Redeploy after setting or changing environment variables.
5. Add the custom domain in Vercel and configure the DNS records shown in its domain settings.
6. Verify the email sending domain with Resend, submit a production test enquiry, and check Resend's delivery events.
7. Monitor failed email requests and delivery events, along with Upstash usage if configured.

No deployment has been performed by this project setup.

## Troubleshooting

- **The form reports missing configuration:** set all three server environment variables (`RESEND_API_KEY`, `COMPANY_ENQUIRY_EMAIL`, and `EMAIL_FROM`) and restart/redeploy.
- **Resend rejects the message:** verify the API key, sender domain, and `EMAIL_FROM` address in Resend.
- **Provider accepted, inbox empty:** acceptance does not guarantee delivery; check spam and the Resend event log.
- **A build requires network access for fonts:** the design loads Bodoni Moda, Instrument Sans, and IBM Plex Mono from Google Fonts; configure network access or replace the stylesheet with locally hosted font files if offline builds are required.
- **Requests are limited inconsistently in Vercel:** the default in-memory limiter is per instance; configure a shared persistent rate limiting backend for multi-instance deployments.
