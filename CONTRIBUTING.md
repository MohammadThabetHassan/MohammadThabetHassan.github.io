# Contributing

Thank you for taking the time to improve this portfolio site. Keep changes focused, preserve the existing visual language, and verify the site locally before opening a pull request.

## What to change

The site is served as a static GitHub Pages application. Hand-maintained source files include `index.html`, `css/`, `js/`, `img/`, `404.html`, metadata files, and the webpack configuration. Project and repository data may be refreshed by the synchronization workflows; do not edit generated data by hand unless the change is specifically intended to update the generation process.

Before changing a project card, confirm the source repository, project title, description, category, technology tags, links, and image alt text. Links to external profiles and projects should use HTTPS. New tab links must retain `rel="noopener"`.

## Local preview

For a content-only change, open `index.html` in a browser and test the affected desktop and mobile layouts. For a webpack development preview, install the locked dependencies and run:

```bash
npm ci
npm start
```

To produce a production build, run:

```bash
npm run build
```

Check the browser console, navigation, contact links, project filters, responsive layout, and image fallbacks. Do not commit `node_modules/`, build output, local credentials, or editor metadata.

## Synchronization workflows

The `.github/workflows/` directory contains the scheduled workflows that refresh project and repository data. Treat `projects.json` and `repos-data.json` as generated outputs when a change originates from those workflows. If a synchronization change produces unexpected content, inspect the workflow logs and the upstream repository metadata before editing the generated result.

Workflow changes must be tested against the smallest representative input available. Avoid broad rewrites of generated files in the same pull request as a workflow change; separate the implementation from the resulting data refresh when practical.

## Pull requests

Create a branch from the current `main` branch using a short, descriptive name. Keep each pull request limited to one coherent change. Use a conventional commit message such as `docs: update contribution guidance`, `fix: correct project link`, or `chore(ci): validate generated data`.

The pull-request description should explain the reason for the change, identify the affected files or workflows, and record the checks that were run. Include screenshots for visual changes when they make the result easier to review. Confirm that the diff contains no secrets, personal data, unrelated generated churn, or accidental dependency changes.

Maintainers may request revisions before merging. Do not force-push shared branches or rewrite commits that another contributor is reviewing.

## Security issues

Do not report security vulnerabilities in a public issue. Follow the private reporting process in [`SECURITY.md`](SECURITY.md).
