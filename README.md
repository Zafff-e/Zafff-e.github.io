# Zafir Hasan — Portfolio

Astro + Tailwind CSS v4 static site. All content lives in `src/data/resume.json`.

```bash
npm install
npm run dev      # local dev server
npm run build    # outputs to dist/
```

Pushes to `main` build the site and publish `dist/` to the `gh-pages` branch
(`.github/workflows/deploy.yml`). In the repo settings, set **Pages → Source** to
"Deploy from a branch" → `gh-pages` / root.
