#!/usr/bin/env node
/**
 * capture-demo.mjs
 *
 * Captures a screenshot of the Research Agent web UI answering a query. Used to
 * (re)generate the demo image embedded in the repository README.
 *
 * Prerequisites -- the app must already be running:
 *   backend:  cd backend  && ..\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
 *   frontend: cd frontend && npm run dev        # Vite dev server on http://localhost:5173
 *   (or `docker compose up --build` from the repository root)
 *
 * Usage (from this scripts/ directory):
 *   npm install          # first time only; installs puppeteer-core
 *   npm run capture      # -> ../assets/demo.png
 *
 *   node capture-demo.mjs --query "..." --theme dark --scale 1 --out ../assets/demo.png --headed
 *
 * Options:
 *   --url <url>           App URL                (default http://localhost:5173)
 *   --query <text>        Query to type          (default: RAG vs. fine-tuning question)
 *   --out <path>          Output PNG             (default ../assets/demo.png)
 *   --theme <light|dark>  Force the UI theme     (default light)
 *   --width <px>          Viewport width         (default 1600)
 *   --height <px>         Viewport height        (default 1200)
 *   --scale <n>           deviceScaleFactor      (default 2; use 1 for a smaller file)
 *   --selector <css>      Capture only this element instead of the whole viewport
 *   --timeout <ms>        Max wait for the answer (default 180000)
 *   --headed              Show the browser window (debugging)
 *   --allow-error         Save the image even if the app shows an error
 *
 * Environment:
 *   CHROME_PATH           Override the Chrome/Edge executable to drive
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const HERE = dirname(fileURLToPath(import.meta.url));

const DEFAULTS = {
  url: "http://localhost:5173",
  query:
    "How does retrieval-augmented generation (RAG) work, and how does it differ from fine-tuning an LLM?",
  out: resolve(HERE, "..", "assets", "demo.png"),
  theme: "light",
  width: 1600,
  height: 1200,
  scale: 2,
  selector: "",
  timeout: 180000,
  headed: false,
  allowError: false,
};

const USAGE = `Usage: node capture-demo.mjs [options]

  --url <url>           App URL                (default ${DEFAULTS.url})
  --query <text>        Query to type          (default: RAG vs. fine-tuning question)
  --out <path>          Output PNG             (default ../assets/demo.png)
  --theme <light|dark>  Force the UI theme     (default light)
  --width <px>          Viewport width         (default 1600)
  --height <px>         Viewport height        (default 1200)
  --scale <n>           deviceScaleFactor      (default 2)
  --selector <css>      Capture only this element
  --timeout <ms>        Max wait for the answer (default 180000)
  --headed              Show the browser window
  --allow-error         Save the image even on an error`;

function parseArgs(argv) {
  const opts = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const next = () => argv[++i];
    switch (argv[i]) {
      case "--url": opts.url = next(); break;
      case "--query": opts.query = next(); break;
      case "--out": opts.out = resolve(process.cwd(), next()); break;
      case "--theme": opts.theme = next(); break;
      case "--width": opts.width = Number(next()); break;
      case "--height": opts.height = Number(next()); break;
      case "--scale": opts.scale = Number(next()); break;
      case "--selector": opts.selector = next(); break;
      case "--timeout": opts.timeout = Number(next()); break;
      case "--headed": opts.headed = true; break;
      case "--allow-error": opts.allowError = true; break;
      case "--help":
      case "-h":
        console.log(USAGE);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${argv[i]}\n\n${USAGE}`);
        process.exit(2);
    }
  }
  return opts;
}

// Common install locations for a Chromium-based browser we can drive. Puppeteer
// ships its own Chromium, but reusing an already-installed browser keeps
// `npm install` small and avoids a second download.
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  process.env.PROGRAMFILES &&
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
  process.env["PROGRAMFILES(X86)"] &&
    `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  process.env.LOCALAPPDATA &&
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  process.env.PROGRAMFILES &&
    `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
  process.env["PROGRAMFILES(X86)"] &&
    `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  for (const name of ["google-chrome", "chromium", "chromium-browser"]) {
    try {
      const found = execFileSync("which", [name], { encoding: "utf8" }).trim();
      if (found && existsSync(found)) return found;
    } catch {
      // `which` unavailable or binary not on PATH; try the next candidate.
    }
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  const chrome = findChrome();
  if (!chrome) {
    throw new Error(
      "Could not find a Chrome/Edge executable. Set CHROME_PATH to its full path."
    );
  }
  console.log(`Using browser: ${chrome}`);

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: !opts.headed,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--force-color-profile=srgb",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: opts.scale,
    });

    console.log(`Opening ${opts.url} ...`);
    await page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Force the requested theme before the app reads its saved preference.
    await page.evaluate((dark) => {
      localStorage.setItem("darkMode", JSON.stringify(dark));
    }, opts.theme === "dark");
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });

    const inputSel = 'input[placeholder="What would you like to know?"]';
    await page.waitForSelector(inputSel, { timeout: 30000 });
    await page.click(inputSel);
    await page.type(inputSel, opts.query, { delay: 10 });
    console.log(`Submitting query: ${opts.query}`);

    // Hide the browser's spell-check squiggles and blinking caret for a clean shot.
    await page.evaluate((sel) => {
      const input = document.querySelector(sel);
      if (input) input.setAttribute("spellcheck", "false");
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, inputSel);

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find(
        (b) => (b.textContent || "").trim() === "Search"
      );
      if (!button) throw new Error("Search button not found");
      button.click();
    });

    console.log("Waiting for the agent to answer (this can take a while) ...");
    // The answer appears in a Paper headed "Research Result"; while the agent is
    // working that panel shows a "Researching..." placeholder instead.
    await page.waitForFunction(
      () => {
        const body = document.body.innerText || "";
        if (!body.includes("Research Result")) return false;
        if (body.includes("Researching...")) return false;
        return body.length > 200;
      },
      { timeout: opts.timeout, polling: 500 }
    );

    const answer = await page.evaluate(() => {
      const panel = document.querySelector(".MuiPaper-elevation3");
      return (panel ? panel.innerText : document.body.innerText) || "";
    });
    if (/Sorry, I encountered an error/i.test(answer) && !opts.allowError) {
      throw new Error(
        `The app returned an error instead of an answer:\n${answer.trim()}`
      );
    }

    await sleep(1500); // Let fonts and Markdown layout settle before shooting.

    mkdirSync(dirname(opts.out), { recursive: true });
    if (opts.selector) {
      const element = await page.waitForSelector(opts.selector, { timeout: 15000 });
      await element.screenshot({ path: opts.out });
    } else {
      await page.screenshot({ path: opts.out });
    }

    const png = readFileSync(opts.out);
    const width = png.readUInt32BE(16); // PNG IHDR width
    const height = png.readUInt32BE(20); // PNG IHDR height
    console.log(
      `Saved ${opts.out} (${width}x${height}, ${(png.length / 1024).toFixed(0)} KB)`
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`\nCapture failed: ${err.message}`);
  process.exit(1);
});
