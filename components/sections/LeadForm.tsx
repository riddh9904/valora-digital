"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, LoaderCircle, RotateCcw } from "lucide-react";
import {
  CHALLENGE_OPTIONS,
  EMPTY_LEAD,
  FIELD_ORDER,
  INDUSTRY_OPTIONS,
  LIMITS,
  MARKET_OPTIONS,
  STEP_ONE_FIELDS,
  STEP_TWO_FIELDS,
  budgetOptionsFor,
  currencyForMarket,
  validateField,
  validateLead,
  type Currency,
  type LeadErrors,
  type LeadField,
  type LeadInput,
} from "@/lib/lead-schema";
import { PREFILL_EVENT, PREFILL_STORAGE_KEY, type PrefillDetail } from "@/lib/prefill";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/config/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: string; message: string };

type Step = 1 | 2;

const IS_DEV = process.env.NODE_ENV === "development";

const STEP_LABELS: Record<Step, string> = {
  1: "Step 1 of 2 · About you",
  2: "Step 2 of 2 · About the work",
};

const CURRENCY_HINT: Record<Currency, string> = {
  INR: "Shown in ₹",
  AED: "Shown in AED",
  USD: "Shown in US $",
};

/** The first field of each step; exactly one of them is rendered at a time. */
const FIRST_FIELD_SELECTOR = "input[name=fullName], select[name=market]";

const ERROR_TEXT = "text-[#c0392b]";

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
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink-900">
        {label}
        {optional && <span className="text-xs font-normal text-graphite">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-graphite">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={`mt-1.5 flex items-start gap-1.5 text-xs ${ERROR_TEXT}`}>
          <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Applies a prefill to the form values. Only industry, challenge and message are touched. */
function withPrefill(v: LeadInput, detail: PrefillDetail): LeadInput {
  return {
    ...v,
    industry: detail.industry ?? v.industry,
    challenge: detail.challenge ?? v.challenge,
    message: typeof detail.message === "string" ? detail.message.slice(0, LIMITS.message) : v.message,
  };
}

/** Reads and removes a prefill handed over from another page (see `prefillEnquiry`). */
function takeStoredPrefill(): PrefillDetail | null {
  try {
    const raw = sessionStorage.getItem(PREFILL_STORAGE_KEY);
    if (raw === null) return null;
    sessionStorage.removeItem(PREFILL_STORAGE_KEY);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;
    const str = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : undefined);
    return { industry: str("industry"), challenge: str("challenge"), message: str("message") };
  } catch {
    return null;
  }
}

export function LeadForm() {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const [values, setValues] = useState<LeadInput>(EMPTY_LEAD);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [step, setStep] = useState<Step>(1);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hp, setHp] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepLabelRef = useRef<HTMLParagraphElement>(null);
  // Focus target to apply once the next render has committed (the target may not exist yet).
  const pendingFocus = useRef<"summary" | string | null>(null);
  const revealStep = useRef(false);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "summary") {
      summaryRef.current?.focus();
      return;
    }
    const el = formRef.current?.querySelector<HTMLElement>(target);
    const label = stepLabelRef.current;
    if (revealStep.current && el && label) {
      // On a step change, bring the step label to the top (below the sticky header, via
      // scroll-padding) instead of letting focus() or scroll anchoring hide it under the header.
      revealStep.current = false;
      label.scrollIntoView({ block: "start" });
      el.focus({ preventScroll: true });
      return;
    }
    el?.focus();
  });

  // Contextual CTAs can pre-fill fields: on this page via an event, from another page via
  // sessionStorage. A prefill never changes the step or replaces a success screen.
  useEffect(() => {
    // Read on the first frame after mount; cancelling on cleanup keeps the stored prefill
    // for the re-mount that Strict Mode performs in development.
    const frame = requestAnimationFrame(() => {
      const stored = takeStoredPrefill();
      if (stored) setValues((v) => withPrefill(v, stored));
    });

    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail ?? {};
      setValues((v) => withPrefill(v, detail));
      setTimeout(
        () => formRef.current?.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR)?.focus({ preventScroll: true }),
        500,
      );
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(PREFILL_EVENT, onPrefill);
    };
  }, []);

  const markStarted = () => setStartedAt((s) => s ?? Date.now());

  const update = <K extends LeadField>(field: K, value: LeadInput[K]) => {
    markStarted();
    const next = { ...values, [field]: value };
    // Budget bands depend on the market's currency; drop a band the new market doesn't offer.
    if (field === "market" && !budgetOptionsFor(String(value)).some((o) => o.value === next.budget)) {
      next.budget = "";
    }
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

  const hasStepOneError = (errs: LeadErrors) => STEP_ONE_FIELDS.some((f) => errs[f]);

  function goToStepTwo() {
    const stepErrors: LeadErrors = Object.fromEntries(STEP_ONE_FIELDS.map((f) => [f, validateField(f, values)]));
    setErrors((e) => ({ ...e, ...stepErrors }));
    setTouched((t) => ({ ...t, ...Object.fromEntries(STEP_ONE_FIELDS.map((f) => [f, true])) }));
    const firstInvalid = STEP_ONE_FIELDS.find((f) => stepErrors[f]);
    if (firstInvalid) {
      pendingFocus.current = `[name=${firstInvalid}]`;
      return;
    }
    setStep(2);
    revealStep.current = true;
    pendingFocus.current = "select[name=market]";
  }

  function goBack() {
    setStep(1);
    setStatus((s) => (s.kind === "error" ? { kind: "idle" } : s));
    revealStep.current = true;
    pendingFocus.current = "input[name=fullName]";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    if (step === 1) {
      goToStepTwo();
      return;
    }
    const all = validateLead(values);
    setErrors(all);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    if (Object.keys(all).length > 0) {
      if (hasStepOneError(all)) setStep(1);
      pendingFocus.current = "summary";
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
        if (hasStepOneError(data.errors)) setStep(1);
        pendingFocus.current = "summary";
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
        message: "We couldn’t reach the server. Please check your connection and try again.",
      });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  // The summary lists only the fields on the visible step.
  const errorList = (step === 1 ? STEP_ONE_FIELDS : STEP_TWO_FIELDS).filter((f) => errors[f]);

  if (status.kind === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[420px] flex-col items-start justify-center rounded-md border border-signal/25 bg-signal/[0.05] p-8 outline-none"
      >
        <CircleCheck aria-hidden className="size-9 text-signal" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl font-medium tracking-tight text-ink-900">Thank you. Your enquiry has been sent.</h3>
        <p className="mt-3 max-w-md leading-relaxed text-graphite">
          We&apos;ll review the details and reply to <span className="text-ink-900">{values.email}</span> to
          arrange a conversation.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY_LEAD);
            setErrors({});
            setTouched({});
            setStartedAt(null);
            setStep(1);
            setStatus({ kind: "idle" });
            pendingFocus.current = "input[name=fullName]";
          }}
          className="mt-8 inline-flex items-center gap-2 text-sm text-graphite underline-offset-4 hover:text-ink-900 hover:underline"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const budgetOptions = budgetOptionsFor(values.market);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-required-note`} className="relative">
      <p ref={stepLabelRef} aria-live="polite" className="kicker mb-5 text-signal">
        {STEP_LABELS[step]}
      </p>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-md border border-[#c0392b]/30 bg-[#c0392b]/[0.04] p-4 text-sm text-ink-900 outline-none"
        >
          <p className="font-medium">Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}:</p>
          <ul className="mt-2 space-y-1">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${fid(f)}`} className={`${ERROR_TEXT} underline underline-offset-2`}>
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p id={`${uid}-required-note`} className="mb-5 text-xs text-graphite">
        All fields are required unless marked optional.
      </p>

      {step === 1 ? (
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
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fid("market")} label="Target market" error={errors.market}>
              <select {...a11y("market")} className="field-input" value={values.market} onChange={(e) => update("market", e.target.value)}>
                <option value="" disabled>Select a market</option>
                {MARKET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id={fid("industry")} label="Industry" error={errors.industry}>
              <select {...a11y("industry")} className="field-input" value={values.industry} onChange={(e) => update("industry", e.target.value)}>
                <option value="" disabled>Select an industry</option>
                {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id={fid("budget")} label="Monthly advertising budget" error={errors.budget} hint={CURRENCY_HINT[currencyForMarket(values.market)]}>
              <select {...a11y("budget", true)} className="field-input" value={values.budget} onChange={(e) => update("budget", e.target.value)}>
                <option value="" disabled>Select a range</option>
                {budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id={fid("challenge")} label="Primary marketing challenge" error={errors.challenge}>
              <select {...a11y("challenge")} className="field-input" value={values.challenge} onChange={(e) => update("challenge", e.target.value)}>
                <option value="" disabled>Select a challenge</option>
                {CHALLENGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id={fid("message")} label="Anything else we should know?" optional error={errors.message} className="sm:col-span-2" hint={`${values.message.length}/${LIMITS.message}. Please don’t include passwords or sensitive personal data.`}>
              <textarea {...a11y("message", true)} rows={4} maxLength={LIMITS.message} className="field-input resize-y" value={values.message} onChange={(e) => update("message", e.target.value)} />
            </Field>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-graphite">
              <input
                {...a11y("consent")}
                type="checkbox"
                checked={values.consent}
                onChange={(e) => {
                  update("consent", e.target.checked);
                  setTouched((t) => ({ ...t, consent: true }));
                  setErrors((er) => ({ ...er, consent: e.target.checked ? undefined : er.consent }));
                }}
                className="mt-1 size-4 shrink-0 cursor-pointer rounded border border-field"
              />
              <span>
                I agree that {site.name} may use these details to respond to my enquiry, as described in the{" "}
                <Link href="/privacy" className="text-ink-900 underline underline-offset-2 hover:text-signal">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.consent && (
              <p id={`${fid("consent")}-error`} className={`mt-1.5 ml-7 flex items-start gap-1.5 text-xs ${ERROR_TEXT}`}>
                <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
                {errors.consent}
              </p>
            )}
          </div>
        </>
      )}

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fid("hp")}>Leave this field empty</label>
        <input id={fid("hp")} type="text" name="company_url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      {step === 2 && status.kind === "error" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="mt-6 rounded-md border border-[#b7791f]/35 bg-[#b7791f]/[0.06] p-4 text-sm leading-relaxed text-ink-900 outline-none">
          {status.code === "not_configured" ? (
            IS_DEV ? (
              <>
                <p className="font-medium">Development notice: lead delivery isn’t configured.</p>
                <p className="mt-1 text-graphite">
                  Set <code className="font-mono text-ink-900">LEAD_WEBHOOK_URL</code> and/or{" "}
                  <code className="font-mono text-ink-900">RESEND_API_KEY</code>,{" "}
                  <code className="font-mono text-ink-900">LEAD_EMAIL_TO</code> and{" "}
                  <code className="font-mono text-ink-900">LEAD_EMAIL_FROM</code> in <code className="font-mono">.env.local</code>, then restart the server. The enquiry was logged in the server console only.
                </p>
              </>
            ) : (
              <p>
                <span className="font-medium">Your enquiry wasn’t sent.</span> Our enquiry form is
                temporarily unavailable. Your details are still in the form, so please try again later
                {site.contact.email ? (
                  <>
                    {" "}or email <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                  </>
                ) : null}
                .
              </p>
            )
          ) : (
            <p>
              <span className="font-medium">Your enquiry wasn’t sent.</span> {status.message} Your
              details are still in the form, so you can try again.
            </p>
          )}
        </div>
      )}

      {step === 1 ? (
        <div className="mt-8">
          <button key="continue" type="submit" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button key="back" type="button" onClick={goBack} disabled={submitting} className={buttonClasses("ghost", "lg", "w-full sm:w-auto")}>
              Back
            </button>
            <button key="send" type="submit" disabled={submitting} aria-disabled={submitting} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
              {submitting ? (
                <>
                  <LoaderCircle aria-hidden className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send enquiry"
              )}
            </button>
          </div>
          <p className="text-xs text-graphite">We only use these details to respond to you.</p>
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}
