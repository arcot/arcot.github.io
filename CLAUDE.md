# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static, single-page personal landing page (English + Italian) in plain HTML, CSS and ES-module JavaScript. There is no build step, package manager, linter or test suite. It is meant to be served as-is from GitHub Pages (`.nojekyll` disables Jekyll; all paths are relative so it works from a user or project repo).

## Workflow

- Commit and push directly to `main`. This repo doesn't use pull/merge requests.
- **The site is live.** GitHub Pages serves `main` (root) of the public `arcot/arcot.github.io` repo at https://arcot.github.io/, so every push to `main` goes live within minutes. The repo and its full history are public: never commit private material (`donotshare/` stays gitignored). Subfolders of `donotshare/` may have their own `CLAUDE.md` describing private workflows; follow it when working there, and never move details from it into this file. Don't deploy the site anywhere else unless the owner asks.
- Testimonials show only the author's role, not their name, until each author approves being named.

## Running locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Always serve over HTTP. Under `file://` the `<script type="module">` is blocked, so the language switch, scroll reveal, menu and carousel won't work.

## Architecture

- **`index.html`**: all markup. The English copy is written inline as the no-JS fallback.
- **`lanagrafica.html`**: the only project subpage. It shares the nav pill, footer, CSS and `main.js`; its nav links point back to `./index.html#…` and its copy uses `lana.*` keys. Project cards without a public page have no satellite arrow at all (never `href="#"`).
- **`assets/js/translations.js`**: the source of truth for all copy, as `translations.en` and `translations.it` dictionaries with matching keys (`hero.*`, `exp.N.*`, `cert.N.*`, `work.N.*`, `words.N.*`, …). A key missing from `it` falls back to `en`.
- **`assets/js/main.js`**: the only script. It runs five independent `init*` functions: language switch, scroll reveal, nav scroll-spy, mobile menu and testimonial carousel.
  - i18n: elements declare `data-i18n="key"` (sets `textContent`) or `data-i18n-attr="attr:key;attr2:key2"` (sets attributes). Buttons with `data-lang` switch language. The choice is kept in `localStorage["lang"]` (wrapped in try/catch). With nothing stored, the language comes from `navigator.language`.
  - Reveal: `[data-reveal]` elements get `.is-visible` via IntersectionObserver. `[data-stagger]` lists set a `--stagger` index (mod 3) on their children.
- **Link previews**: each page's `<head>` has a meta `description` and Open Graph tags. They're the one exception to relative paths: crawlers need absolute `https://arcot.github.io/…` URLs. `assets/img/og-image.png` (1200×630) and the favicons are generated PNGs; they aren't hand-edited. After changing preview tags, refresh LinkedIn's cache with its Post Inspector.
- **Analytics**: both pages load GoatCounter (cookieless, no consent banner) from `<head>`. To count clicks on an element, give it `data-goatcounter-click="name"`. Use names like `contact-*`, `project-*` and `lang-*`. GoatCounter doesn't count visits from localhost.
- **Progressive enhancement**: an inline script in `<head>` adds a `js` class to `<html>`. JS-only styles (collapsed mobile menu, carousel controls, reveal animations) are scoped under `.js`, and reveal animations also sit behind `prefers-reduced-motion: no-preference`. Keep the page fully usable without JS.
- **CSS**: `assets/css/tokens.css` defines every color, font, size, radius and duration as custom properties. `assets/css/style.css` builds layout and components **only** from those tokens and never hardcodes values. To add a new value, define a token first.

## Editing rules

- **When you change English copy, change it in both places**: `translations.js` (`en`) and the inline fallback text in `index.html`.
- Every new translation key goes into both `en` and `it`.
- To add a career move, certification, project or testimonial, copy an existing block in `index.html` (`.htl-career li.htl-stop`, `.htl-certs li.htl-cert`, `.work-grid li`, `.quote-track li`) and add the matching `exp.N.*` / `cert.N.*` / `work.N.*` / `words.N.*` keys. For projects, also bump the `wN-view` / `wN-title` ids and give the portrait an icon: add a `<symbol>` to the sprite at the top of `index.html` with the same `stroke-width="1"` outline attributes as the other project icons, and reference it with `<svg class="portrait-icon">`.
- The Career & Certifications timeline is horizontal on a shared year axis. `.htl-track` sets `--from` (first year) and `--years` (axis length). Each `.htl-stop` sets `--start` / `--end` and each `.htl-cert` sets `--at` inline; CSS positions them as a percentage of the axis. Widen the axis if a year falls outside it. `.htl-stop--now` marks the current role. Keep certifications to the most relevant few.
- Contact links (email, LinkedIn) live only in the hero. The footer is just the bottom line.
- To show a photo in a `.portrait`, place an `<img>` inside it. CSS crops it to a circle.

## Design system

`design_mastercar.md` is the visual spec (a warm editorial style inspired by Mastercard): cream canvas `#F3F0EE` instead of white, ink-black CTAs, very large radii and pill shapes, circular portraits with "satellite" arrow CTAs, orange orbital arcs, and eyebrow labels with an accent dot. Signal orange is used sparingly. `tokens.css` mirrors §2–§6 of the spec. Check its "Do's and Don'ts" (§7) and responsive rules (§8) before you make visual changes. The site uses Sofia Sans from Google Fonts in place of the proprietary MarkForMC.
