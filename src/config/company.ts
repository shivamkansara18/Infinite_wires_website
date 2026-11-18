export const company = {
  name: "Infinite Wires & Components Pvt. Ltd.",
  shortName: "Infinite Wires",
  description:
    "Submersible copper winding wire in custom sizes. 100% pure EC grade copper. Making it since 2008.",
  established: 2008,
  contact: {
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "",
    hours: process.env.NEXT_PUBLIC_COMPANY_HOURS ?? "",
  },
};

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
