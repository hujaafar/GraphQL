import test from "node:test";
import assert from "node:assert/strict";
import { print, visit, type ArgumentNode, type FieldNode } from "graphql";
import { GET_DASHBOARD } from "../src/graphql/dashboard-query";

test("all module XP views use the same event scope and no mutation is present", () => {
  const scoped = new Set(["moduleXP", "projectXP", "exerciseXP", "transactions"]);
  const visited = new Set<string>();
  visit(GET_DASHBOARD, {
    OperationDefinition(node) {
      assert.equal(node.operation, "query");
    },
    Field(node: FieldNode) {
      if (!node.alias || !scoped.has(node.alias.value)) return;
      const where = node.arguments?.find(
        (argument: ArgumentNode) => argument.name.value === "where",
      );
      assert.ok(where);
      assert.match(print(where), /event:\s*\{\s*path:\s*\{\s*_eq: \$modulePath/);
      visited.add(node.alias.value);
    },
  });
  assert.deepEqual(visited, scoped);
});
