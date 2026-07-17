# FitVerse Polished UX Upgrade

This build keeps the project frontend-only and improves the existing prototype without adding a backend.

## UX fixes

- Mobile sidebar closes by outside tap, close button, navigation, or Escape.
- Notification center is rendered above blur layers, so messages stay sharp and readable.
- Notifications can be opened, dismissed individually, or cleared together.
- Notification panel closes by outside tap, close button, Done button, or Escape.
- Modals retain outside-click and Escape closing.
- All visible scrollbars are hidden while scrolling continues normally.
- Page changes scroll to the top and update the browser tab title.
- `/` focuses the global search field.

## Visual improvements

- Site-wide typography increased for normal reading distance.
- Tiny labels, badges, descriptions, charts, cards, forms, and modal text enlarged.
- New page, drawer, overlay, card, toast, and progress animations.
- Improved focus styles and reduced-motion support.
- Responsive bottom-sheet notification layout on phones.

## Quality checks

- `npm run lint` passes with no warnings.
- `npm run build` passes.
- `npm audit` reports 0 vulnerabilities at the time this package was generated.
- GitHub Pages workflow uses Node.js 22.

## Run locally

```bash
npm install
npm run dev
```
