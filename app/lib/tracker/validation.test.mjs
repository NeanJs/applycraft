import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("./validation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});
const validation = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

describe("tracker request validation", () => {
  it("accepts only JSON objects and handles malformed JSON", async () => {
    assert.deepEqual(
      await validation.readJsonRecord(
        new Request("https://example.test", {
          method: "POST",
          body: '{"company":"Acme"}',
        }),
      ),
      { company: "Acme" },
    );
    assert.equal(
      await validation.readJsonRecord(
        new Request("https://example.test", { method: "POST", body: "[" }),
      ),
      null,
    );
    assert.equal(
      await validation.readJsonRecord(
        new Request("https://example.test", {
          method: "POST",
          body: "[]",
        }),
      ),
      null,
    );
  });

  it("normalizes optional strings and rejects non-string values", () => {
    assert.deepEqual(validation.parseOptionalString("  Acme  "), {
      valid: true,
      value: "Acme",
    });
    assert.deepEqual(validation.parseOptionalString("  "), {
      valid: true,
      value: null,
    });
    assert.deepEqual(validation.parseOptionalString(42), { valid: false });
  });

  it("accepts valid dates and rejects malformed date values", () => {
    const parsed = validation.parseOptionalDate("2026-01-15T12:00:00.000Z");
    assert.equal(parsed.valid, true);
    if (parsed.valid) {
      assert.equal(parsed.value?.toISOString(), "2026-01-15T12:00:00.000Z");
    }

    assert.deepEqual(validation.parseOptionalDate("not-a-date"), {
      valid: false,
    });
    assert.deepEqual(validation.parseOptionalDate(123), { valid: false });
  });
});
