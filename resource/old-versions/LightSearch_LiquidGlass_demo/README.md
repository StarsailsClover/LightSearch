# LightSearch — Liquid Glass Demo

This is a demonstration project inspired by the Liquid Glass visual language.
It is an original implementation that reproduces the frosted-glass look and behavior
(backdrop-filter blur, pearlescent edges, soft highlights) without copying any
third-party code verbatim.

## What is included
- `index.html` — single-page app UI
- `styles.css` — theme system (classic + liquid)
- `app.js` — frontend logic: modal manager, i18n, progressive rendering
- `server.js` — tiny Express mock API that returns search sources with delay hints
- `i18n/*.json` — translation files (en, zh, ja, ko, ru)
- `package.json` — scripts and server dependency

## Run locally
1. unzip the package
2. install dependencies: `npm install`
3. copy `index.html`, `styles.css`, `app.js` into a folder named `public` (or use the simple script below)
4. start server: `npm start`
5. open http://localhost:3000 in your browser

Or use a static server: `npx serve public -l 5000` after copying files into `public`.

## Notes on Liquid Glass
This project intentionally *recreates* the visual effect using CSS features available in modern browsers:
- `backdrop-filter` for blur
- translucent backgrounds with controlled alpha
- soft border and highlight layers using layered backgrounds and pseudo-elements
If you want «exact» visuals from a third-party repo, please check the original project license and repository
and we can adapt permissible pieces with attribution. For learning purposes this recreation is designed to be
readable and easy to modify.
