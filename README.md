# myuzicbyabhishek

Portfolio site for myuzicbyabhishek, an independent producer and singer from Pune.

Plain HTML, CSS and JavaScript with no build step. Everything served lives in `public/`.

- `public/index.html`: the page
- `public/styles.css`: design tokens (light and dark), layout and motion
- `public/app.js`: the track list, preview player, contact settings (`CONFIG`) and the contact form (Web3Forms)
- `public/audio/`: 24-second song previews
- `public/img/`: cover art and studio photos (photo credits are in the footer)

Preview it locally with `python3 -m http.server -d public 8765`. Deployed on Vercel (see `vercel.json`).
