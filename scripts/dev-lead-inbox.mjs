/**
 * Local test inbox for the enquiry form. Development only.
 *
 * Point LEAD_WEBHOOK_URL at http://localhost:4000/lead in .env.local, run
 * `npm run dev:inbox`, and every enquiry submitted on the site is printed here
 * and appended to .dev-leads.jsonl. Nothing leaves your machine.
 */
import { appendFileSync } from "node:fs";
import { createServer } from "node:http";

const PORT = Number(process.env.INBOX_PORT ?? 4000);
const LOG_FILE = new URL("../.dev-leads.jsonl", import.meta.url);

createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405).end();
    return;
  }
  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    try {
      const payload = JSON.parse(raw);
      appendFileSync(LOG_FILE, JSON.stringify(payload) + "\n");
      console.log(`\n📩 Enquiry received ${payload.submittedAt}`);
      console.table(payload.lead);
      res.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
    } catch {
      res.writeHead(400).end();
    }
  });
}).listen(PORT, () => {
  console.log(`Test inbox listening on http://localhost:${PORT}/lead`);
});
