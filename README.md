# mohammadthabethassan.github.io

Source for my portfolio, served by GitHub Pages at [mohammadthabethassan.github.io](https://mohammadthabethassan.github.io).

## Stack

Plain HTML, one stylesheet and one script. No framework, no bundler, no build step: GitHub Pages serves the `main` branch as-is. Three.js (particle background and globe) and GSAP (timeline animation) load from cdnjs; everything else is in the repository.

```
index.html          page structure and content, in section order
css/style.css       the whole stylesheet
js/app.js           background, globe, cursor, typewriter, skills sphere, project cards, certificates, contact form
certs.json          Credly badges and certificates (rendered by js/app.js)
img/portrait.webp   photo used in the hero and About
img/projects/       project covers, 1200x675 WebP, taken from each repository's own screenshots
img/badges/         Credly badge images, 320x320 WebP
img/certs/          certificate thumbnails, 640px wide WebP
img/og.png          social preview image, 1200x630
cv.pdf              downloadable CV
tests/              checks run by CI
scripts/serve.js    local preview server
```

## Sections

| # | Section | What is in it |
|---|---|---|
| | Hero | Name, typewriter roles, one-line summary, CV download, portrait inside the globe |
| | Stats | IEEE papers, projects, credentials, awards |
| 01 | About | Bio, contact chips, photo, and two experience cards |
| 02 | Skills | Draggable 3D tag sphere (security, programming, soft skills) |
| 03 | Projects | Ten project cards with real screenshots and a category filter, plus links to more repositories |
| 04 | Research | Three IEEE papers with DOIs and one manuscript in preparation |
| 05 | Achievements | Competition timeline |
| 06 | Certifications | Five Credly badges and eighteen certificates with a category filter |
| 07 | Contact | Email, LinkedIn, GitHub, phone, and a form that opens your mail app |

## Local preview

```bash
npm start
```

This runs a small static server on http://localhost:8080 with no dependencies. Use it rather than opening `index.html` from disk: the certificates section loads `certs.json` with `fetch`, which browsers block on `file://` URLs.

## Checks

```bash
npm test
```

The tests confirm that the required sections and navigation links exist, that the contact details are current, that every local file referenced by `index.html`, `js/app.js` and `certs.json` is in the repository, that every project card has a cover image and https links, that the CV is a real PDF, and that DOI links are present. GitHub Actions runs the same tests on every push to `main` and every pull request, and validates the HTML with html-validate.

## Editing

### Add a project

Add an object to the `PROJECTS` array near the top of the projects block in `js/app.js`:

```js
{
  title:'Project name', cats:['Security','AI/ML'], lang:'Python', year:'2026',
  image:'img/projects/project-name.webp', alt:'What the screenshot shows',
  desc:'What it does and why it matters.',
  facts:['One concrete number','Another'],
  topics:['topic-one','topic-two'],
  code:'https://github.com/MohammadThabetHassan/project-name',
  demo:'https://...',   // optional; also paper: and pypi:
}
```

`cats` takes any of `Security`, `AI/ML`, `SOC`, `Forensics`, `Web`, `Tools`; the filter buttons and their counts are generated from these values. Put a 1200x675 WebP screenshot in `img/projects/`. Cards are shown in array order.

### Add a certificate or badge

Edit `certs.json`. A certificate needs `name`, `issuer`, `issuerKey` (used for the coloured pill: `Google`, `Meta`, `Cisco`, `Udacity`, `UCSD`, `UPenn`, `Coursera`, `ECCouncil`, `Packt`, `Nomu`, `London`, or `Other`), `image` (640px-wide WebP in `img/certs/`), `verify` (the issuer's verification URL, or an empty string), `category` (`cybersecurity`, `ai`, `programming` or `data`) and an optional `meta` line. A badge needs `name`, `issuer`, `image` (320x320 WebP in `img/badges/`) and the Credly public URL.

### Add a publication

Copy one `<article class="pub-card">` block in the `#publications` section of `index.html` and update the number, title, authors, venue, result line and links. Keep author order as indexed by the publisher.

### Add an achievement

Copy one `<div class="t-item">` block in the `#achievements` timeline and update the icon, title, text and year.

### Update the CV

Replace `cv.pdf`. The hero button downloads it as `Mohammad_Thabet_Hassan_CV.pdf`.

### Images

Convert new images to WebP before committing. With Python and Pillow:

```python
from PIL import Image
im = Image.open("source.png")
im.thumbnail((1200, 1200))      # 640 for certificates, 320 for badges
im.save("img/projects/name.webp", "WEBP", quality=82, method=6)
```

## License

Code is released under the MIT License (see `LICENSE.txt`). The text, photos, certificate images and CV are personal content and are not covered by that license.
