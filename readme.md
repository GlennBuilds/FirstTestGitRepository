# Balkan Roadtrip Planner

This repository contains the Balkan roadtrip planning pages for June/July 2026.

## Files
- `index.html` – redirect to the main roadtrip dashboard
- `routekaart.html` – main roadtrip dashboard with mobile views for overview, map, and day planning
- `detailplanning.html` – archived detailed day-by-day planning page
- `balkan_route_definitief_donderdag_2026.html` – redirect kept for old links
- `styles.css` – styling for the detailed planning page
- `app.js` – small interactions for the detailed planning page
- `manifest.webmanifest` – PWA manifest for GitHub Pages
- `sw.js` – service worker for offline caching
- `offline.html` – fallback page when an uncached request is unavailable
- `assets/icons/` – app icons for PWA and iPhone home screen

## Run locally
Because this is plain HTML/CSS/JS, you can open the HTML files directly in a browser.

Optional local server:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000/routekaart.html.

## GitHub Pages
The published app runs at:

https://glennbuilds.github.io/Balkan2026

The PWA manifest uses `/Balkan2026/` as both start URL and scope, so the installed app opens correctly from GitHub Pages.

## Add to iPhone home screen
1. Open https://glennbuilds.github.io/Balkan2026 in Safari.
2. Tap the Share button.
3. Choose "Add to Home Screen".
4. Keep the name "Balkan2026" or choose your own label.
5. Open the app from the new home screen icon once while you still have internet.

## Test offline use on iPhone
1. Open https://glennbuilds.github.io/Balkan2026 with internet.
2. Add it to the home screen from Safari.
3. Open the app once from the home screen with internet.
4. Turn on airplane mode.
5. Open the app again and check that the route and travel information remain visible.

The core trip content and route data are local files and are cached by the service worker. The app also caches OpenStreetMap tiles and OSRM route geometry at runtime after they have been viewed online. Offline map detail is therefore available for areas you opened before; areas that were never loaded may show a simple fallback background while the routes, stops, and travel information remain visible.
