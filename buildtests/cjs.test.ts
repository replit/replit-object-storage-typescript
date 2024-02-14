import { expect, test } from "vitest";
// @ts-ignore
const storage = require("../dist");

test("cjs import test", async () => {
  expect(storage).toBeTruthy();
  expect(storage.Client).toBeTruthy();
});