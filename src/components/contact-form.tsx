"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { enquirySchema, type EnquiryInput } from "@/lib/enquiry-schema";
import { isValidDiameter } from "@/lib/product";

function newRequestId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof enquirySchema>, unknown, EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      companyName: "",
      phone: "",
      email: "",
      copperOD: undefined,
      overallOD: undefined,
      quantity: "",
      message: "",
      website: "",
    },
  });

  const initialDimensions = useMemo(
    () => ({
      copperOD: searchParams.get("copperOD"),
      overallOD: searchParams.get("overallOD"),
    }),
    [searchParams],
  );

  useEffect(() => {
    const copperOD = Number(initialDimensions.copperOD);
    const overallOD = Number(initialDimensions.overallOD);
    if (
      initialDimensions.copperOD &&
      initialDimensions.overallOD &&
      isValidDiameter(copperOD, overallOD)
    ) {
      setValue("copperOD", copperOD, { shouldValidate: true });
      setValue("overallOD", overallOD, { shouldValidate: true });
    }
  }, [initialDimensions, setValue]);

  const submit = handleSubmit(async (values) => {
    setStatus(null);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": newRequestId(),
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        accepted?: boolean;
        message?: string;
        error?: string;
      };
      if (!response.ok || !result.accepted) {
        throw new Error(
          result.error || "We could not send your enquiry. Please retry.",
        );
      }
      setStatus({
        type: "success",
        message:
          result.message ?? "Your enquiry was accepted by our email provider.",
      });
      reset({
        ...values,
        name: "",
        phone: "",
        email: "",
        message: "",
        website: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your enquiry. Please retry.",
      });
    }
  });

  const copyEnquiry = async () => {
    if (!formRef.current) {
      setStatus({
        type: "error",
        message:
          "The enquiry form is unavailable. Please reload and try again.",
      });
      return;
    }
    const values = new FormData(formRef.current);
    const labels: Record<string, string> = {
      name: "Full Name",
      companyName: "Company Name",
      phone: "Phone Number",
      email: "Email Address",
      copperOD: "Copper OD (mm)",
      overallOD: "Overall OD (mm)",
      quantity: "Quantity",
      message: "Additional Message",
    };
    const text = Object.entries(labels)
      .map(([key, label]) => `${label}: ${values.get(key) || "Not provided"}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus({
        type: "error",
        message: "Clipboard access is unavailable in this browser.",
      });
    }
  };

  const message = (name: keyof EnquiryInput) => {
    const error = errors[name];
    return error?.message ? (
      <span className="field-error" role="alert">
        {String(error.message)}
      </span>
    ) : null;
  };

  return (
    <form
      ref={formRef}
      className="enquiry-form"
      id="enquiry-form"
      noValidate
      onSubmit={submit}
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            autoComplete="name"
            maxLength={100}
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
          />
          {message("name")}
        </div>
        <div className="field">
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            autoComplete="organization"
            maxLength={120}
            {...register("companyName")}
          />
          {message("companyName")}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
          />
          {message("phone")}
        </div>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {message("email")}
        </div>
        <div className="field">
          <label htmlFor="copperOD">Copper OD (mm)</label>
          <input
            id="copperOD"
            type="number"
            inputMode="decimal"
            min="0.5"
            max="4"
            step="0.05"
            {...register("copperOD")}
            aria-invalid={Boolean(errors.copperOD)}
          />
          {message("copperOD")}
        </div>
        <div className="field">
          <label htmlFor="overallOD">Overall OD (mm)</label>
          <input
            id="overallOD"
            type="number"
            inputMode="decimal"
            min="0.6"
            max="5"
            step="0.05"
            {...register("overallOD")}
            aria-invalid={Boolean(errors.overallOD)}
          />
          {message("overallOD")}
        </div>
        <div className="field field-full">
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" maxLength={100} {...register("quantity")} />
          {message("quantity")}
        </div>
        <div className="field field-full">
          <label htmlFor="message">Additional Message</label>
          <textarea
            id="message"
            rows={5}
            maxLength={1500}
            {...register("message")}
          />
          {message("message")}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <div className="field-full form-actions">
          <p className="form-hint">
            At least one contact method is required. We use these details only
            to respond to your enquiry.
          </p>
          <button
            className="btn btn-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending…" : "Send enquiry"}
          </button>
          {status && (
            <p className={`form-status ${status.type}`} role="status">
              {status.message}
            </p>
          )}
          <button
            className="link-button copy-button"
            type="button"
            onClick={copyEnquiry}
          >
            {copied ? "Copied" : "Copy enquiry"}
          </button>
        </div>
      </div>
    </form>
  );
}
