/**
 * 壳模式冒烟：加载首页并注入打开插件商店所需的最小状态探测。
 * 依赖本机 Chrome headless；仅用于本地验证，不进 CI。
 *
 * 注意：新版 Chrome 不再支持 `--dump-dom=<file>`，DOM 只能从 stdout 取；
 * 本机代理会劫持 localhost 请求，必须显式 --no-proxy-server。
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:5173/";
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
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

const result = spawnSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-proxy-server",
    "--virtual-time-budget=20000",
    "--timeout=120000",
    "--dump-dom",
    "--enable-logging=stderr",
    "--log-level=0",
    url,
  ],
  { encoding: "utf8", maxBuffer: 40 * 1024 * 1024 },
);

const html = result.stdout ?? "";
const consoleText = result.stderr ?? "";
const markers = {
  sidebar: html.includes('data-testid="sidebar"'),
  workspaceShell: html.includes("data-workspace-shell"),
  shellUser: html.includes("Shell Preview"),
  errorBoundary:
    html.includes("这块界面出了点问题") ||
    html.includes("这部分界面出了点问题") ||
    html.includes("应用界面出了点问题"),
  mapCrash: /reading ['"]map['"]/.test(consoleText),
  typeError: /TypeError:/.test(consoleText),
};
console.log(
  JSON.stringify(
    {
      markers,
      logSnippet: consoleText
        .split("\n")
        .filter((l) => /TypeError|CONSOLE:.*Error/.test(l))
        .slice(0, 12),
    },
    null,
    2,
  ),
);
process.exit(markers.errorBoundary || markers.mapCrash || !markers.sidebar ? 2 : 0);
