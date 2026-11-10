# Claywell release verification

Checked 2026-11-10 in Chromium through an HTTP server bound to localhost. No app files were opened through file://.

## Completed

- `npm run check`: JavaScript syntax checks and all 13 Node tests passed.
- `npm run build`: passed. The static output excludes development test pages.
- `/tests/browser.html`: **22 passed, 0 failed**, observed in the actual browser. Covers keyboard sculpting with real vertex changes, exact undo/redo, brush selection and controls, materials, wire overlay, presets, project import restoration, cancellation and OBJ geometry counts.
- Autosave smoke test outside test mode: Changed the material to Verdigris, reloaded, and verified Verdigris remained selected.
- Desktop and 390px iframe layouts inspected. Controls remain available below the viewport on narrow screens. Fresh browser captures are saved in `docs/screenshots/desktop.png` and `narrow.png`. Narrow capture is the 390px app iframe, not a physical-device test.

- Fixed desktop footer overlap: the main grid now grows with its content. Browser measurement confirmed its height grew from 700px to approximately 884px; the fresh screenshot shows the footer below the panels.

## Verification limits

The browser harness invokes real app handlers, substitutes synthetic test files, and intercepts generated download links to inspect their data. It does not certify the operating system file chooser or delivery of downloads. A separate real-download attempt timed out in browser tooling, so native download completion is not claimed. Pointer gestures, physical-touch input, pressure devices, other browsers and assistive technologies have not received exhaustive manual testing.

Unit tests cover geometry, validation, history and OBJ serialization; they supplement rather than replace browser checks. Product capability limits are documented in the README.


## Publication

The tested runtime commit `3eb77ff4cb0241c94e7f650d5ccfff4d4f367914` was pushed to [the public repository](https://github.com/intrepion/kata-app-inspired-by-zbrush-codex-dot). Its checks, build, and GitHub Pages deployment succeeded in [run 42748693596](https://github.com/intrepion/kata-app-inspired-by-zbrush-codex-dot/actions/runs/42748693596) on 2026-11-10. The app is available at [Kata Claywell](https://intrepion.github.io/kata-app-inspired-by-zbrush-codex-dot/). This publication record does not expand the local device, accessibility or file-dialog verification described above.
