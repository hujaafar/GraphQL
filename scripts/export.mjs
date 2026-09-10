import { spawnSync } from "node:child_process";

// Keep the regular Next.js/Vercel build available alongside the portable static build.
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, GRAPHITE_STATIC_EXPORT: "1" },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
