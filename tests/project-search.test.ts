import test from "node:test";
import assert from "node:assert/strict";
import { matchesProjectName } from "../src/lib/project-search";

test("project search accepts display names, slugs, case, and repeated spaces", () => {
  for (const query of [
    "mini framework",
    "MINI-FRAMEWORK",
    " mini   framework ",
    "mini_framework",
    "framework",
  ]) {
    assert.equal(matchesProjectName("mini-framework", query), true, query);
  }
  assert.equal(matchesProjectName("ascii_art_web", "art web"), true);
  assert.equal(matchesProjectName("mini-framework", "  "), true);
  assert.equal(matchesProjectName("mini-framework", "graphql"), false);
});
