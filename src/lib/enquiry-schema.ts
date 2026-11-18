import { z } from "zod";

const optionalDimension = z.preprocess(
  (value) =>
    value === "" || value === undefined || value === null
      ? undefined
      : Number(value),
  z.number().finite().optional(),
);

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name.").max(100),
    companyName: z.string().trim().max(120).optional().default(""),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (value) =>
          value === "" ||
          (/^[+\d().\-\s]{7,30}$/.test(value) &&
            (value.match(/\d/g)?.length ?? 0) >= 7),
        {
          message: "Enter a valid phone number.",
        },
      )
      .optional()
      .default(""),
    email: z
      .union([z.literal(""), z.email("Enter a valid email address.").max(254)])
      .optional()
      .default(""),
    copperOD: optionalDimension.pipe(z.number().min(0.5).max(4).optional()),
    overallOD: optionalDimension.pipe(z.number().min(0.6).max(5).optional()),
    quantity: z.string().trim().max(100).optional().default(""),
    message: z.string().trim().max(1500).optional().default(""),
    website: z.string().max(200).optional().default(""),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.email && !value.phone) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Please provide an email address or phone number.",
      });
    }

    if (
      value.copperOD !== undefined &&
      value.overallOD !== undefined &&
      value.overallOD - value.copperOD < 0.05
    ) {
      context.addIssue({
        code: "custom",
        path: ["overallOD"],
        message: "Overall OD must be at least 0.05 mm larger than Copper OD.",
      });
    }

    for (const [field, diameter] of [
      ["copperOD", value.copperOD],
      ["overallOD", value.overallOD],
    ] as const) {
      if (
        diameter !== undefined &&
        Math.abs(diameter * 100 - Math.round(diameter * 100)) > 1e-6
      ) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Use increments of 0.05 mm.",
        });
      } else if (
        diameter !== undefined &&
        Math.round(diameter * 100) % 5 !== 0
      ) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Use increments of 0.05 mm.",
        });
      }
    }
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;
