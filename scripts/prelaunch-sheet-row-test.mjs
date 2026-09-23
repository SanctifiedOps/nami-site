import { findMemberSheetRow } from "../lib/network-sync/find-sheet-row.ts";

const headers = ["Directory ID", "Member ID"];
const cases = [
  { name: "new member ID", rows: [headers, ["", "test-id"]], expected: 1 },
  { name: "legacy Directory ID", rows: [headers, ["test-id", ""]], expected: 1 },
  { name: "both IDs in one row", rows: [headers, ["test-id", "test-id"]], expected: 1 },
  { name: "missing ID", rows: [headers, ["someone-else", ""]], expected: -1 },
];
for (const test of cases) {
  if (findMemberSheetRow(headers, test.rows, "test-id") !== test.expected) {
    throw new Error(`${test.name} failed.`);
  }
  console.log(`PASS ${test.name}`);
}
for (const test of [
  { name: "duplicate ID", rows: [headers, ["test-id", ""], ["", "test-id"]] },
  { name: "conflicting Directory ID", rows: [headers, ["someone-else", "test-id"]] },
]) {
  let rejected = false;
  try { findMemberSheetRow(headers, test.rows, "test-id"); } catch { rejected = true; }
  if (!rejected) throw new Error(`${test.name} was not rejected.`);
  console.log(`PASS ${test.name} rejected`);
}
