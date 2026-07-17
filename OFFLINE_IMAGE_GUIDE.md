# FitVerse v1.7 Offline Image Guide

- Exercise photos are stored inside `public/exercise-media`.
- The app does not need internet access to display workout photos.
- Next, Previous, queue selection, and replacement changes update the local photo immediately.
- The production build includes the photos in `dist/exercise-media`.
- A lightweight service worker caches the app after the first production visit, improving offline browser use.
- Original photo source: Free Exercise DB, published under the Unlicense/public domain.

## Run locally

```bash
npm install
npm run dev
```

## Production test

```bash
npm run build
npm run preview
```
