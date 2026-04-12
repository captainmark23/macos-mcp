/**
 * Unit tests for Notes tool-level pure functions and SQLite query logic.
 * These tests run without macOS databases — they only test parsing/formatting logic.
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getNotesFolders, getDefaultNotesAccount } from "../notes/tools.js";

// ─── getNotesFolders ─────────────────────────────────────────────

describe("getNotesFolders", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.MACOS_MCP_NOTES_FOLDERS;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.MACOS_MCP_NOTES_FOLDERS;
    } else {
      process.env.MACOS_MCP_NOTES_FOLDERS = originalEnv;
    }
  });

  it("returns null when env var is not set", () => {
    delete process.env.MACOS_MCP_NOTES_FOLDERS;
    assert.equal(getNotesFolders(), null);
  });

  it("returns array of trimmed folder names", () => {
    process.env.MACOS_MCP_NOTES_FOLDERS = " Work , Personal , Ideas ";
    const result = getNotesFolders();
    assert.deepEqual(result, ["Work", "Personal", "Ideas"]);
  });

  it("filters out empty entries", () => {
    process.env.MACOS_MCP_NOTES_FOLDERS = "Work,,Personal,";
    const result = getNotesFolders();
    assert.deepEqual(result, ["Work", "Personal"]);
  });

  it("returns null for empty string", () => {
    process.env.MACOS_MCP_NOTES_FOLDERS = "";
    assert.equal(getNotesFolders(), null);
  });
});

// ─── getDefaultNotesAccount ─────────────────────────────────────

describe("getDefaultNotesAccount", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.MACOS_MCP_NOTES_ACCOUNT;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.MACOS_MCP_NOTES_ACCOUNT;
    } else {
      process.env.MACOS_MCP_NOTES_ACCOUNT = originalEnv;
    }
  });

  it("returns undefined when env var is not set", () => {
    delete process.env.MACOS_MCP_NOTES_ACCOUNT;
    assert.equal(getDefaultNotesAccount(), undefined);
  });

  it("returns the account name when set", () => {
    process.env.MACOS_MCP_NOTES_ACCOUNT = "iCloud";
    assert.equal(getDefaultNotesAccount(), "iCloud");
  });

  it("returns undefined for empty string", () => {
    process.env.MACOS_MCP_NOTES_ACCOUNT = "";
    assert.equal(getDefaultNotesAccount(), undefined);
  });
});

// ─── Notes tool registration ─────────────────────────────────────

describe("Notes tool registration", () => {
  it("can import registerNotesTools without error", async () => {
    const mod = await import("../notes/register.js");
    assert.equal(typeof mod.registerNotesTools, "function");
    assert.equal(typeof mod.registerNotesResources, "function");
  });

  it("exports NoteSummaryZ schema", async () => {
    const mod = await import("../notes/register.js");
    assert.ok(mod.NoteSummaryZ);
    assert.equal(typeof mod.NoteSummaryZ.parse, "function");
  });
});
