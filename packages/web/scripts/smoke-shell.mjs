/**
 * 壳模式冒烟：加载首页并注入打开插件商店所需的最小状态探测。
 * 依赖本机 Chrome headless；仅用于本地验证，不进 CI。
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2] ?? "http://127.0.0.1:5191/";
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const browser = chromeCandidates.find((path) => {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
});
if (!browser) {
  console.error("no chrome/edge");
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "zcode-shell-smoke-"));
const out = join(dir, "page.html");
const log = join(dir, "chrome.log");
const result = spawnSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--virtual-time-budget=20000",
    "--timeout=120000",
    `--dump-dom=${out}`,
    "--enable-logging=stderr",
    "--log-level=0",
    url,
  ],
  { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
);
writeFileSync(log, `${result.stderr ?? ""}\n${result.stdout ?? ""}`);
const html = readFileSync(out, "utf8");
const consoleText = readFileSync(log, "utf8");
const markers = {
  sidebar: html.includes('data-testid="sidebar"'),
  workspaceShell: html.includes("data-workspace-shell"),
  shellUser: html.includes("Shell Preview"),
  errorBoundary: html.includes("这部分界面出了点问题") || html.includes("应用界面出了点问题"),
  mapCrash: /reading ['"]map['"]/.test(consoleText),
  typeError: /TypeError:/.test(consoleText),
};
console.log(JSON.stringify({ markers, logSnippet: consoleText.split("\n").filter((l) => /TypeError|CONSOLE:.*Error/.test(l)).slice(0, 12) }, null, 2));
process.exit(markers.errorBoundary || markers.mapCrash ? 2 : 0);
