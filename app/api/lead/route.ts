/**
 * POST /api/lead: receives enquiry-form submissions.
 *
 * Delivery destinations (configure one or both via environment variables):
 *   • Webhook: LEAD_WEBHOOK_URL (+ optional LEAD_WEBHOOK_SECRET sent as
 *     `X-Webhook-Secret`). Works with Zapier, Make, n8n, HubSpot workflows,
 *     Slack incoming webhooks via a relay, or your own endpoint.
 *   • Email (Resend): RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM.
 *
 * The response is `ok: true` only when at least one destination accepted the
 * lead. If nothing is configured the API returns 503 `not_configured` and logs
 * the enquiry server-side so it is never silently discarded.
 */
import {
  BUDGET_OPTIONS,
  CHALLENGE_OPTIONS,
  INDUSTRY_OPTIONS,
  MARKET_OPTIONS,
  coerceLead,
  labelFor,
  validateLead,
  type LeadInput,
} from "@/lib/lead-schema";
import { site } from "@/config/site";

const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

// Best-effort, per-instance rate limiting. For multi-instance deployments use a
// shared store (e.g. Upstash Redis) or your platform's firewall rules.
const hits = new Map<string, number[]>();

function rateLimited(key: string, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

const json = (body: object, status = 200) => Response.json(body, { status });

function readable(lead: LeadInput) {
  return {
    "Full name": lead.fullName,
    Email: lead.email,
    Company: lead.company,
    Website: lead.website || "–",
    Industry: labelFor(INDUSTRY_OPTIONS, lead.industry),
    "Target market": labelFor(MARKET_OPTIONS, lead.market),
    "Monthly ad budget": labelFor(BUDGET_OPTIONS, lead.budget),
    "Primary challenge": labelFor(CHALLENGE_OPTIONS, lead.challenge),
    Message: lead.message || "–",
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendWebhook(url: string, payload: object) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.LEAD_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.LEAD_WEBHOOK_SECRET;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  // Some receivers (e.g. Google Apps Script) can't set status codes and report
  // failure in the body instead.
  const result = await res.json().catch(() => null);
  if (result?.ok === false) throw new Error(`Webhook rejected the lead: ${result.error ?? "unknown"}`);
}

async function sendResendEmail(lead: LeadInput, submittedAt: string) {
  const fields = readable(lead);
  const text = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM,
      to: process.env.LEAD_EMAIL_TO!.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `New enquiry: ${lead.company} (${lead.fullName})`,
      text: `New enquiry via ${site.name} website\nSubmitted: ${submittedAt}\n\n${text}`,
      html: `<p>New enquiry via the ${escapeHtml(site.name)} website<br><small>${escapeHtml(submittedAt)}</small></p><table style="font:14px/1.5 sans-serif">${rows}</table>`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text().catch(() => "")}`);
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip, now)) {
    return json({ ok: false, code: "rate_limited", message: "Too many submissions. Please try again in a few minutes." }, 429);
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, code: "too_large" }, 413);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalid_json" }, 400);
  }

  // Spam checks: hidden honeypot field + minimum time on form.
  if (typeof body.hp === "string" && body.hp.length > 0) {
    return json({ ok: false, code: "rejected", message: "Your submission could not be accepted." }, 400);
  }
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_FILL_MS) {
    return json(
      { ok: false, code: "too_fast", message: "That was quick! Please review your details and submit again." },
      400,
    );
  }

  const lead = coerceLead(body);
  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, code: "validation", errors }, 400);
  }

  const submittedAt = new Date(now).toISOString();
  const payload = {
    type: "website_enquiry",
    source: site.name,
    submittedAt,
    page: request.headers.get("referer") ?? null,
    lead,
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  const resendReady = Boolean(
    process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO && process.env.LEAD_EMAIL_FROM,
  );

  const tasks: { name: string; run: () => Promise<void> }[] = [];
  if (webhookUrl) tasks.push({ name: "webhook", run: () => sendWebhook(webhookUrl, payload) });
  if (resendReady) tasks.push({ name: "email", run: () => sendResendEmail(lead, submittedAt) });

  if (tasks.length === 0) {
    // Never silently drop an enquiry: keep a server-side record and tell the client.
    console.error("[lead] No delivery destination configured. Enquiry NOT delivered:", JSON.stringify(payload));
    return json(
      {
        ok: false,
        code: "not_configured",
        message: "Lead delivery is not configured on the server.",
      },
      503,
    );
  }

  const results = await Promise.allSettled(tasks.map((t) => t.run()));
  const delivered = results.filter((r) => r.status === "fulfilled").length;
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[lead] ${tasks[i].name} delivery failed:`, r.reason);
  });

  if (delivered === 0) {
    console.error("[lead] All destinations failed. Enquiry:", JSON.stringify(payload));
    return json({ ok: false, code: "delivery_failed", message: "We couldn't deliver your enquiry." }, 502);
  }

  return json({ ok: true });
}
