import { test } from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { moveFile, moveFileWith } from "../src/fsutil.js";

const tmp = () => mkdtempSync(join(tmpdir(), "fsutil-"));
const exdev = () => { throw Object.assign(new Error("cross-device"), { code: "EXDEV" }); };

test("moveFile_renames_same_dir", () => {
  const d = tmp();
  writeFileSync(join(d, "a"), "hello");
  moveFile(join(d, "a"), join(d, "b"));
  assert.equal(existsSync(join(d, "a")), false);
  assert.equal(readFileSync(join(d, "b"), "utf8"), "hello");
});

test("moveFile_falls_back_on_exdev", () => {
  const d = tmp();
  writeFileSync(join(d, "a"), "payload");
  moveFileWith({ renameSync: exdev, copyFileSync, unlinkSync }, join(d, "a"), join(d, "b"));
  assert.equal(existsSync(join(d, "a")), false);
  assert.equal(readFileSync(join(d, "b"), "utf8"), "payload");
});

test("moveFile_keeps_source_when_copy_fails", () => {
  const d = tmp();
  writeFileSync(join(d, "a"), "keep");
  const failCopy = () => { throw new Error("disk full"); };
  assert.throws(() => moveFileWith({ renameSync: exdev, copyFileSync: failCopy, unlinkSync }, join(d, "a"), join(d, "b")), /disk full/);
  assert.equal(readFileSync(join(d, "a"), "utf8"), "keep");
});

test("moveFile_rethrows_other_errors", () => {
  const d = tmp();
  assert.throws(() => moveFileWith({ renameSync, copyFileSync, unlinkSync }, join(d, "missing"), join(d, "b")), /ENOENT/);
});

test("moveFile_succeeds_when_unlink_fails_after_copy", () => {
  const d = tmp();
  writeFileSync(join(d, "a"), "copied");
  const failUnlink = () => { throw Object.assign(new Error("busy"), { code: "EBUSY" }); };
  moveFileWith({ renameSync: exdev, copyFileSync, unlinkSync: failUnlink }, join(d, "a"), join(d, "b"));
  assert.equal(readFileSync(join(d, "b"), "utf8"), "copied");
  assert.equal(readFileSync(join(d, "a"), "utf8"), "copied"); // left behind, not lost
});
