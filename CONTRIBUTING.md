# Contributing

This is a personal portfolio, so most changes come from me. Corrections are welcome: a broken link, a typo, an accessibility problem, or a layout bug on a device I have not tested.

## Before you open a pull request

1. Run the local server with `npm start` and check the change on a desktop and a phone-sized viewport.
2. Run `npm test`. It checks that every local reference in `index.html` resolves, that the required sections and contact details are present, and that no link uses plain `http://`.
3. Keep the change small and focused. One fix per pull request.

## What to keep in mind

- The site is plain HTML, CSS and JavaScript with no build step. Do not add a bundler, a framework or a runtime dependency.
- Project cards and certificates are rendered by `js/app.js` from the `PROJECTS` array and `certs.json`, so a change to either must be checked in the browser, not only in the source.
- Images go in `img/` as WebP. Project covers are 1200x675, badge images 320x320, certificate thumbnails 640px wide.
- Links to other sites open in a new tab and carry `rel="noopener"`.
- Do not change facts about me (dates, titles, results, author order) unless you can point to the source that shows the current text is wrong.

## Commit messages

Use a short imperative subject with a type prefix, for example `fix: correct DOI link for paper 2` or `docs: explain how to add a badge`.

## Security issues

Do not report security problems in a public issue. Follow [SECURITY.md](SECURITY.md).
