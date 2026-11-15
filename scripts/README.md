# scripts

Helper scripts for maintaining this repository.

## capture-demo.mjs

Captures a screenshot of the running app answering a question and writes it to
`../assets/demo.png`, which is embedded near the top of the root `README.md`. Re-run it
whenever the UI changes so the README image stays current.

It drives an already-installed Chrome (or Edge) via
[`puppeteer-core`](https://pptr.dev/), so `npm install` stays small — no bundled
Chromium is downloaded.

### 1. Start the app

With the repository running locally (see the root `README.md` for API keys):

```powershell
# from backend/
..\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000

# from frontend/
npm run dev
```

Or just `docker compose up --build` from the repository root.

### 2. Capture

```powershell
cd scripts
npm install       # first time only
npm run capture   # writes ../assets/demo.png
```

The script opens <http://localhost:5173>, types a representative question, waits
for the agent's Markdown answer to render, and saves the screenshot.

### Options

| Option | Default | Description |
| --- | --- | --- |
| `--url <url>` | `http://localhost:5173` | App URL to capture |
| `--query <text>` | RAG vs. fine-tuning question | Question typed into the form |
| `--out <path>` | `../assets/demo.png` | Output PNG path |
| `--theme <light\|dark>` | `light` | Force the UI theme |
| `--width <px>` / `--height <px>` | `1600` / `1200` | Viewport size |
| `--scale <n>` | `2` | `deviceScaleFactor`; use `1` for a smaller file |
| `--selector <css>` | whole viewport | Capture only a single element |
| `--timeout <ms>` | `180000` | Max time to wait for an answer |
| `--headed` | off | Show the browser window (debugging) |
| `--allow-error` | off | Save the image even if the app shows an error |

Examples:

```powershell
# A dark-theme, half-size image of a different question
npm run capture -- --theme dark --scale 1 --query "Compare the populations of Tokyo and New York City"

# Capture just the result panel
npm run capture -- --selector ".MuiPaper-root"
```

### Notes

- Set the `CHROME_PATH` environment variable if Chrome/Edge is not found
  automatically.
- The script exits non-zero (and leaves the existing image untouched) if the app
  returns an error instead of an answer; pass `--allow-error` to override.
