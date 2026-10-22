"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, LoaderCircle, RotateCcw } from "lucide-react";
import {
  BUDGET_OPTIONS,
  CHALLENGE_OPTIONS,
  EMPTY_LEAD,
  FIELD_ORDER,
  INDUSTRY_OPTIONS,
  LIMITS,
  MARKET_OPTIONS,
  validateField,
  validateLead,
  type LeadErrors,
  type LeadField,
  type LeadInput,
} from "@/lib/lead-schema";
import { PREFILL_EVENT, type PrefillDetail } from "@/lib/prefill";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/config/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: string; message: string };

const IS_DEV = process.env.NODE_ENV === "development";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-200">
        {label}
        {optional && <span className="text-xs font-normal text-slate-500">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs text-[#f5a3a3]">
          <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm() {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const [values, setValues] = useState<LeadInput>(EMPTY_LEAD);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hp, setHp] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Contextual CTAs elsewhere on the page can pre-select fields.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail ?? {};
      setValues((v) => ({
        ...v,
        industry: detail.industry ?? v.industry,
        challenge: detail.challenge ?? v.challenge,
      }));
      setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }), 500);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const markStarted = () => setStartedAt((s) => s ?? Date.now());

  const update = <K extends LeadField>(field: K, value: LeadInput[K]) => {
    markStarted();
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
  };

  const blur = (field: LeadField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values) }));
  };

  const a11y = (field: LeadField, hasHint = false) => ({
    id: fid(field),
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${fid(field)}-error` : hasHint ? `${fid(field)}-hint` : undefined,
    onBlur: () => blur(field),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const all = validateLead(values);
    setErrors(all);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    if (Object.keys(all).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, hp, startedAt: startedAt ?? Date.now() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: LeadErrors;
      };
      if (res.ok && data.ok === true) {
        setStatus({ kind: "success" });
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (data.code === "validation" && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setStatus({
        kind: "error",
        code: data.code ?? `http_${res.status}`,
        message: data.message ?? "Something went wrong while sending your enquiry.",
      });
    } catch {
      setStatus({
        kind: "error",
        code: "network",
        message: "We couldn't reach the server. Please check your connection and try again.",
      });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  if (status.kind === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[420px] flex-col items-start justify-center rounded-[var(--radius-lg)] border border-emerald-400/20 bg-emerald-400/[0.05] p-8 outline-none"
      >
        <CircleCheck aria-hidden className="size-9 text-emerald-300" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-2xl font-semibold text-white">Thank you. Your enquiry has been sent.</h3>
        <p className="mt-3 max-w-md leading-relaxed text-slate-300">
          We&apos;ll review the details and reply to <span className="text-white">{values.email}</span> to
          arrange a conversation.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY_LEAD);
            setErrors({});
            setTouched({});
            setStartedAt(null);
            setStatus({ kind: "idle" });
          }}
          className="mt-8 inline-flex items-center gap-2 text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-required-note`} className="relative">
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-[var(--radius-md)] border border-[#f08a8a]/30 bg-[#f08a8a]/[0.06] p-4 text-sm text-slate-200 outline-none"
        >
          <p className="font-medium text-white">Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}:</p>
          <ul className="mt-2 space-y-1">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${fid(f)}`} className="text-[#f5a3a3] underline underline-offset-2">
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p id={`${uid}-required-note`} className="mb-5 text-xs text-slate-500">
        All fields are required unless marked optional.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fid("fullName")} label="Full name" error={errors.fullName}>
          <input {...a11y("fullName")} type="text" autoComplete="name" maxLength={LIMITS.name} className="field-input" value={values.fullName} onChange={(e) => update("fullName", e.target.value)} />
        </Field>
        <Field id={fid("email")} label="Business email" error={errors.email}>
          <input {...a11y("email")} type="email" autoComplete="email" inputMode="email" className="field-input" value={values.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field id={fid("company")} label="Company name" error={errors.company}>
          <input {...a11y("company")} type="text" autoComplete="organization" maxLength={LIMITS.company} className="field-input" value={values.company} onChange={(e) => update("company", e.target.value)} />
        </Field>
        <Field id={fid("website")} label="Website" optional error={errors.website}>
          <input {...a11y("website")} type="text" inputMode="url" autoComplete="url" placeholder="company.com" maxLength={LIMITS.website} className="field-input" value={values.website} onChange={(e) => update("website", e.target.value)} />
        </Field>
        <Field id={fid("industry")} label="Industry" error={errors.industry}>
          <select {...a11y("industry")} className="field-input" value={values.industry} onChange={(e) => update("industry", e.target.value)}>
            <option value="" disabled>Select an industry</option>
            {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id={fid("market")} label="Target market" error={errors.market}>
          <select {...a11y("market")} className="field-input" value={values.market} onChange={(e) => update("market", e.target.value)}>
            <option value="" disabled>Select a market</option>
            {MARKET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id={fid("budget")} label="Monthly advertising budget" error={errors.budget} hint="Approximate USD equivalent">
          <select {...a11y("budget", true)} className="field-input" value={values.budget} onChange={(e) => update("budget", e.target.value)}>
            <option value="" disabled>Select a range</option>
            {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id={fid("challenge")} label="Primary marketing challenge" error={errors.challenge}>
          <select {...a11y("challenge")} className="field-input" value={values.challenge} onChange={(e) => update("challenge", e.target.value)}>
            <option value="" disabled>Select a challenge</option>
            {CHALLENGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id={fid("message")} label="Anything else we should know?" optional error={errors.message} className="sm:col-span-2" hint={`${values.message.length}/${LIMITS.message}. Please don't include passwords or sensitive personal data.`}>
          <textarea {...a11y("message", true)} rows={4} maxLength={LIMITS.message} className="field-input resize-y" value={values.message} onChange={(e) => update("message", e.target.value)} />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fid("hp")}>Leave this field empty</label>
        <input id={fid("hp")} type="text" name="company_url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-300">
          <input
            {...a11y("consent")}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => {
              update("consent", e.target.checked);
              setTouched((t) => ({ ...t, consent: true }));
              setErrors((er) => ({ ...er, consent: e.target.checked ? undefined : er.consent }));
            }}
            className="mt-1 size-4 shrink-0 cursor-pointer rounded border-white/30 bg-transparent accent-[var(--brand-accent-bright)]"
          />
          <span>
            I agree that {site.name} may use these details to respond to my enquiry, as described in the{" "}
            <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-accent-soft">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${fid("consent")}-error`} className="mt-1.5 ml-7 flex items-start gap-1.5 text-xs text-[#f5a3a3]">
            <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="mt-6 rounded-[var(--radius-md)] border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm leading-relaxed text-slate-200 outline-none">
          {status.code === "not_configured" ? (
            IS_DEV ? (
              <>
                <p className="font-medium text-white">Development notice: lead delivery isn’t configured.</p>
                <p className="mt-1">
                  Set <code className="font-mono text-amber-200">LEAD_WEBHOOK_URL</code> and/or{" "}
                  <code className="font-mono text-amber-200">RESEND_API_KEY</code>,{" "}
                  <code className="font-mono text-amber-200">LEAD_EMAIL_TO</code> and{" "}
                  <code className="font-mono text-amber-200">LEAD_EMAIL_FROM</code> in <code className="font-mono">.env.local</code>, then restart the server. The enquiry was logged in the server console only.
                </p>
              </>
            ) : (
              <p>
                <span className="font-medium text-white">Your enquiry wasn’t sent.</span> Our enquiry form is
                temporarily unavailable. Your details are still in the form, so please try again later
                {site.contact.email ? (
                  <>
                    {" "}or email <a className="text-white underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                  </>
                ) : null}
                .
              </p>
            )
          ) : (
            <p>
              <span className="font-medium text-white">Your enquiry wasn’t sent.</span> {status.message} Your
              details are still in the form, so you can try again.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={submitting} aria-disabled={submitting} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
        <p className="text-xs text-slate-500">We only use these details to respond to you.</p>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}
