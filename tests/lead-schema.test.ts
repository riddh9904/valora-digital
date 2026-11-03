import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BUDGET_OPTIONS,
  MARKET_OPTIONS,
  STEP_ONE_FIELDS,
  STEP_TWO_FIELDS,
  budgetOptionsFor,
  currencyForMarket,
  labelFor,
  validateField,
  validateLead,
  type LeadInput,
} from "@/lib/lead-schema";

const valid: LeadInput = {
  fullName: "Asha Rao",
  email: "asha@example.com",
  company: "Acme",
  website: "",
  industry: "education",
  market: "india",
  budget: "inr-1l-3l",
  challenge: "lead-quality",
  message: "",
  consent: true,
};

test("market maps to currency", () => {
  assert.equal(currencyForMarket("india"), "INR");
  assert.equal(currencyForMarket("uae-gcc"), "AED");
  assert.equal(currencyForMarket("other"), "USD");
  assert.equal(currencyForMarket("multiple"), "USD");
  assert.equal(currencyForMarket(""), "USD");
});

test("market options", () =>
  assert.deepEqual(MARKET_OPTIONS.map((o) => o.value), ["india", "uae-gcc", "other", "multiple"]));

test("INR bands", () =>
  assert.deepEqual(budgetOptionsFor("india").map((o) => o.value), [
    "inr-under-1l", "inr-1l-3l", "inr-3l-10l", "inr-10l-30l", "inr-30l-plus", "not-sure",
  ]));

test("AED bands", () =>
  assert.deepEqual(budgetOptionsFor("uae-gcc").map((o) => o.value), [
    "aed-under-7500", "aed-7500-20k", "aed-20k-55k", "aed-55k-185k", "aed-185k-plus", "not-sure",
  ]));

test("USD bands keep existing values", () =>
  assert.deepEqual(budgetOptionsFor("other").map((o) => o.value), [
    "under-2k", "2k-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure",
  ]));

test("INR label", () =>
  assert.equal(budgetOptionsFor("india")[1].label, "₹1–3 lakh / month"));

test("budget must match market currency", () => {
  assert.equal(validateField("budget", { ...valid, market: "india", budget: "under-2k" }), "Please select a budget range.");
  assert.equal(validateField("budget", { ...valid, market: "india", budget: "inr-1l-3l" }), undefined);
  assert.equal(validateField("budget", { ...valid, market: "uae-gcc", budget: "not-sure" }), undefined);
});

test("old market values rejected", () =>
  assert.ok(validateField("market", { ...valid, market: "us" })));

test("valid lead has no errors", () => assert.deepEqual(validateLead(valid), {}));

test("step fields", () => {
  assert.deepEqual(STEP_ONE_FIELDS, ["fullName", "email", "company", "website"]);
  assert.deepEqual(STEP_TWO_FIELDS, ["market", "industry", "budget", "challenge", "message", "consent"]);
});

test("labelFor knows every band", () => {
  assert.equal(labelFor(BUDGET_OPTIONS, "aed-185k-plus"), "AED 185,000+ / month");
  assert.equal(labelFor(BUDGET_OPTIONS, "50k-plus"), "$50,000+ / month");
});

test("every value fits coerceLead limits", () => {
  for (const o of BUDGET_OPTIONS) assert.ok(o.value.length <= 20);
  for (const o of MARKET_OPTIONS) assert.ok(o.value.length <= 20);
});
