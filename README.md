# Personal Landing Page

A single-page landing page in a warm editorial style (see `design_mastercar.md`), in English and Italian.
Plain HTML, CSS and JavaScript: no build step, no dependencies.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Serve it over HTTP. Opening `index.html` straight from disk (`file://`) blocks the
JavaScript module, so the language switch won't work.

## Editing copy

All text lives in **`assets/js/translations.js`**, as one `en` and one `it` dictionary with
matching keys. Elements in `index.html` point at a key with `data-i18n="key"` (text) or
`data-i18n-attr="aria-label:key"` (attributes).

`index.html` also holds the English text as the fallback for visitors without JavaScript.
When you change an English string, change it in both places.

Links (email, LinkedIn) are plain `href`s in `index.html`, once in the hero and once
in the footer. Each project's link is the round arrow button (`.satellite`) on its portrait.

To show a photo instead of the monogram or number, put an `<img src="…" alt="…">` inside the
`.portrait` element. It is cropped to a circle.

## Adding an entry

| To add…     | Copy this block in `index.html`                      | Then add keys          |
|-------------|------------------------------------------------------|------------------------|
| Career move | an `<li class="htl-stop">` inside `.htl-career`      | `exp.N.*`              |
| Certification | an `<li class="htl-cert">` inside `.htl-certs`     | `cert.N.*`             |
| Project     | an `<li>` inside `.work-grid`                        | `work.N.*`             |
| Testimonial | an `<li>` inside `.quote-track`                      | `words.N.*`            |

On the timeline, each career move sets `--start` / `--end` (years) and each certification
sets `--at` in its `style`. If a new year falls outside the axis, adjust `--from` / `--years`
on `.htl-track`. Move the `htl-stop--now` class to the current role. List only the
certifications worth highlighting; ones close together alternate above and below.

For a project, bump the number on the portrait and the `wN-view` / `wN-title` ids. Add each
new key to **both** `en` and `it`.
If a key is missing from `it`, the English text is shown instead.

## Styling

- `assets/css/tokens.css`: every color, font, size and duration, as custom properties.
- `assets/css/style.css`: layout and components, built only from those tokens.

## Deploy (GitHub Pages)

1. Push this folder to a repo named `<username>.github.io`.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
3. Wait for the Pages build, then open `https://<username>.github.io`.

`.nojekyll` tells Pages to serve the files as they are, without running Jekyll. All paths
are relative, so the page also works from a project repo (`<username>.github.io/<repo>`).
