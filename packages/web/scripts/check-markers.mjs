import { readFileSync } from "node:fs";

const html = readFileSync(process.argv[2], "utf8");
console.log(
  JSON.stringify(
    {
      sidebar: html.includes('data-testid="sidebar"'),
      workspace: html.includes("data-workspace-shell"),
      user: html.includes("Shell Preview"),
      errorBoundary:
        html.includes("这部分界面出了点问题") || html.includes("应用界面出了点问题"),
    },
    null,
    2,
  ),
);
