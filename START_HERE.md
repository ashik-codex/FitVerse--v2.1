# FitVerse v2.0 — Start Here

## Run

```bash
npm install
npm run dev
```

## Important when upgrading from v1.7

Use this v2.0 folder as a new project folder. Do not copy it into the old v1.7 folder. The app automatically unregisters old service workers in development, but close old browser tabs and open the new localhost link shown by Vite.

## Verify replacement photos

```bash
npm run verify:media
```

The verification fails if Hammer Curl, EZ-Bar Curl and Cable Hammer Curl accidentally share the same offline image.

## Quality checks

```bash
npm run lint
npm run build
```
