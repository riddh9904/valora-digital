import test from "node:test";
import assert from "node:assert/strict";
import { dailyByChannel, selectPeriods, totals } from "@/lib/metrics";

test("cpql series matches totals for a single day", () => {
  const { current, dates } = selectPeriods({ range: 7, channel: "meta", campaignId: "all" });
  const day = dates.at(-1)!;
  const rows = current.filter((r) => r.date === day);
  const expected = Math.round((totals(rows).spend / totals(rows).qualified) * 100) / 100;
  assert.equal(dailyByChannel(current, dates, "cpql").at(-1)!.meta, expected);
});
