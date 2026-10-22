/**
 * Google Apps Script: free lead inbox for the website enquiry form.
 *
 * Every enquiry is added as a row in the Google Sheet this script is attached
 * to, and a notification email is sent to NOTIFY_EMAIL.
 *
 * Setup: Extensions → Apps Script in a new Google Sheet, paste this file,
 * fill in the two settings, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Set the site's LEAD_WEBHOOK_URL to
 * the web app URL followed by ?key=<SECRET_KEY>.
 *
 * Apps Script can't set HTTP status codes or read request headers, so the key
 * travels in the URL and failures are reported as {"ok": false}.
 */

// ─── Settings ────────────────────────────────────────────────────────────────
const SECRET_KEY = "PASTE_SECRET_KEY_HERE";
const NOTIFY_EMAIL = "riddhi.9904@gmail.com";
// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = [
  "Submitted at", "Full name", "Email", "Company", "Website", "Industry",
  "Target market", "Monthly budget", "Primary challenge", "Message", "Consent", "Page",
];

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET_KEY) {
    return reply({ ok: false, error: "unauthorized" });
  }

  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "invalid_json" });
  }
  const lead = payload.lead || {};

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      payload.submittedAt, lead.fullName, lead.email, lead.company, lead.website,
      lead.industry, lead.market, lead.budget, lead.challenge, lead.message,
      lead.consent ? "Yes" : "No", payload.page,
    ].map(safeCell));
  } catch (err) {
    console.error("Could not save enquiry", err);
    return reply({ ok: false, error: "sheet_failed" });
  }

  // The lead is already saved, so a mail failure doesn't fail the request.
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: lead.email,
      subject: "New enquiry: " + lead.company + " (" + lead.fullName + ")",
      body: [
        "New enquiry via the website",
        "Submitted: " + payload.submittedAt,
        "",
        "Name: " + lead.fullName,
        "Email: " + lead.email,
        "Company: " + lead.company,
        "Website: " + (lead.website || "–"),
        "Industry: " + lead.industry,
        "Target market: " + lead.market,
        "Monthly budget: " + lead.budget,
        "Primary challenge: " + lead.challenge,
        "Message: " + (lead.message || "–"),
        "",
        "All enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join("\n"),
    });
  } catch (err) {
    console.error("Enquiry saved but email failed", err);
  }

  return reply({ ok: true });
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

// Stop text such as "=HYPERLINK(...)" from being run as a spreadsheet formula.
function safeCell(value) {
  if (value === undefined || value === null) return "";
  const s = String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
