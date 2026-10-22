# LearnHi

**Created By Tanmay Dhatrak**

GitHub owner: [Dtanmay-02](https://github.com/Dtanmay-02).

A responsive collection of greetings in 80 languages, built with HTML, CSS, and JavaScript. Search for a language or greeting, explore by region, copy a hello, or discover a random greeting.

## Publish with GitHub Pages

1. Create a public repository called `learnhi` in the `Dtanmay-02` GitHub account.
2. Add the contents of this folder at the repository root. Keep `index.html`, `styles.css`, `app.js`, `greetings.js`, `favicon.svg`, and `sources.json` together.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, then choose **main** and **/ (root)** and save.
5. Open the published link shown in the Pages settings after deployment finishes.

The planned URL is `https://dtanmay-02.github.io/learnhi/`. This is the expected address after GitHub Pages is enabled and deployment succeeds; it is not a confirmation that the site is live. No build command, database, or server runtime is required. The `.nojekyll` file tells GitHub Pages to serve the static files directly.

## Edit locally

Open `index.html` in a browser, or run `python -m http.server 4173` from this folder and visit `http://localhost:4173`.

- `index.html`: page structure and LearnHi branding
- `styles.css`: responsive design
- `app.js`: search, filters, copying, and random greetings
- `greetings.js`: greeting collection
- `sources.json`: content reference notes

Google Fonts are optional; system fonts are used when they cannot load. This is a curated collection, not an exhaustive list of every language. Greeting usage varies by context, and regional groups are approximate.
