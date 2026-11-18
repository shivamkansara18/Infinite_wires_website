import { NextResponse } from "next/server";
import { Resend } from "resend";
import { company } from "@/config/company";
import { enquirySchema } from "@/lib/enquiry-schema";
import { checkEnquiryLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function display(value: string | number | undefined): string {
  return value === undefined || value === "" ? "Not provided" : String(value);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please submit a valid enquiry." },
      { status: 400 },
    );
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and correct the highlighted information.",
      },
      { status: 400 },
    );
  }

  const enquiry = parsed.data;
  if (enquiry.website) {
    return NextResponse.json(
      { error: "Please submit the form again." },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const clientKey =
    forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const idempotencyKey = request.headers.get("idempotency-key")?.slice(0, 100);
  if (!idempotencyKey) {
    return NextResponse.json(
      { error: "Please retry your enquiry." },
      { status: 400 },
    );
  }
  let limit: Awaited<ReturnType<typeof checkEnquiryLimit>>;
  try {
    limit = await checkEnquiryLimit(clientKey, idempotencyKey);
  } catch {
    console.error("Enquiry rate limiter is unavailable.");
    return NextResponse.json(
      {
        error:
          "We could not process your enquiry right now. Please try again later.",
      },
      { status: 503 },
    );
  }
  if (limit === "duplicate") {
    return NextResponse.json(
      {
        error:
          "This enquiry was just submitted. Please wait a moment before retrying.",
      },
      { status: 409 },
    );
  }
  if (limit === "limited") {
    return NextResponse.json(
      {
        error:
          "Too many enquiries from this connection. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": "3600" },
      },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.COMPANY_ENQUIRY_EMAIL?.trim() || "infinitewires@gmail.com";
  const sender = process.env.EMAIL_FROM;
  if (!apiKey || !sender) {
    console.error("Enquiry email configuration is incomplete.");
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? "Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM."
            : "We could not send your enquiry right now. Please try again later.",
      },
      { status: 503 },
    );
  }

  const rows: Array<[string, string]> = [
    ["Full Name", enquiry.name],
    ["Company Name", display(enquiry.companyName)],
    ["Phone Number", display(enquiry.phone)],
    ["Email Address", display(enquiry.email)],
    [
      "Copper OD",
      enquiry.copperOD === undefined
        ? "Not provided"
        : `${enquiry.copperOD} mm`,
    ],
    [
      "Overall OD",
      enquiry.overallOD === undefined
        ? "Not provided"
        : `${enquiry.overallOD} mm`,
    ],
    ["Quantity", display(enquiry.quantity)],
  ];
  const submittedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date()) + " UTC";
  const safeSubjectName = enquiry.name.replace(/[\r\n]+/g, " ").trim();
  const sections = [
    { heading: "Customer Details", rows: rows.slice(0, 4) },
    { heading: "Product Requirements", rows: rows.slice(4) },
  ];
  const message = enquiry.message || "Not provided";
  const plainText = [
    "New website enquiry",
    ...sections.flatMap(({ heading, rows }) => [
      "",
      `${heading}:`,
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ]),
    "",
    "Additional Message:",
    message,
    "",
    `Submitted: ${submittedAt}`,
    "Source: Infinite Wires & Components website",
  ].join("\n");
  const details = sections.map(({ heading, rows }) => `
    <h2 style="font-size:17px;margin:24px 0 8px">${heading}</h2>
    <table style="border-collapse:collapse;width:100%">
      ${rows.map(([label, value]) => `
        <tr>
          <th scope="row" style="width:38%;text-align:left;vertical-align:top;padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</th>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;overflow-wrap:anywhere">${escapeHtml(value)}</td>
        </tr>
      `).join("")}
    </table>
  `).join("");
  const html = `
    <div style="max-width:640px;margin:0 auto;padding:16px;font-family:Arial,sans-serif;line-height:1.5;color:#17243c">
      <p style="margin:0">${escapeHtml(company.name)}</p>
      <h1 style="font-size:24px;margin:4px 0 0">New website enquiry</h1>
      ${details}
      <h2 style="font-size:17px;margin:24px 0 8px">Additional Message</h2>
      <p style="margin:0;padding:12px;background:#f1f5f9;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>")}</p>
      <p style="font-size:13px;color:#475569;margin-top:24px">Submitted ${escapeHtml(submittedAt)} via the Infinite Wires &amp; Components website.</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `${company.shortName} <${sender}>`,
      to: [recipient],
      subject: `Website enquiry — ${safeSubjectName}`,
      text: plainText,
      html,
      ...(enquiry.email ? { replyTo: enquiry.email } : {}),
    });
    if (result.error) {
      console.error("Enquiry email provider rejected a message.");
      return NextResponse.json(
        {
          error:
            "We could not send your enquiry right now. Please try again later.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json(
      {
        accepted: true,
        message:
          "Your enquiry was accepted by our email provider. This does not confirm delivery to the inbox.",
      },
      { status: 200 },
    );
  } catch {
    console.error("Enquiry email provider request failed.");
    return NextResponse.json(
      {
        error:
          "We could not send your enquiry right now. Please try again later.",
      },
      { status: 502 },
    );
  }
}
