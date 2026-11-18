import { test } from "node:test";
import assert from "node:assert/strict";
import { classify } from "../src/errors.js";

test("classify_maps_known_messages", () => {
  assert.equal(classify("Flow blocked this on policy grounds"), "policy");
  assert.equal(classify('Flow is rate-limiting this account ("unusual activity"). Nothing was generated. Wait before retrying.'), "rate_limited");
  assert.equal(classify("A generation is running in the Flow tab"), "busy");
  assert.equal(classify("The browser has been closed"), "busy");
  assert.equal(classify("Timed out waiting for the clip"), "timeout");
  assert.equal(classify("EXDEV: cross-device link not permitted"), "download");
  assert.equal(classify("tile menu has no Download item"), "download");
  assert.equal(classify("quote 40 is above max_credits 10"), "quote_exceeded");
  assert.equal(classify("Not signed in to Flow"), "not_signed_in");
  assert.equal(classify("something odd"), "failed");
});
