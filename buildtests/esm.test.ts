import { expect, test } from "vitest";
// @ts-ignore
import * as storageStarImport from "../dist";
// @ts-ignore
import { Client as ClientImport } from "../dist";

test("esm import test", async () => {
  expect(storageStarImport).toBeTruthy();
  expect(storageStarImport.Client).toBeTruthy();
  expect(ClientImport).toBeTruthy();
});