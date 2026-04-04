# Mohammad Thabet - Portfolio Site

Personal portfolio deployed via GitHub Pages at [mohammadthabethassan.github.io](https://mohammadthabethassan.github.io).

## Stack

Plain HTML + CSS + vanilla JS. No build step required - GitHub Pages serves `index.html` directly.

## Sections

| Section | Description |
|---------|-------------|
| Hero | Photo, name, tagline, CTA buttons, social links |
| About | Bio, photo, stats (projects, certs, awards) |
| Achievements | Competition wins, hackathons, workshops |
| Skills | Categorized skill tags (Languages, Security, Tools) |
| Projects | 10 project cards with category filter (Security, AI, Mobile, Tools) |
| Education | B.Sc. Cyber Security at CUD |
| Certifications | 3 Credly badges + 11 course certificates |
| Contact | Email, LinkedIn, GitHub, Phone + contact form |

## How to Edit

### Add a project

1. Find the `<div class="projects__grid">` section in `index.html`
2. Copy an existing `<article class="project-card" data-category="...">` block
3. Update `data-category` with one or more: `security`, `ai`, `mobile`, `tools`
4. Update the title, description, tech tags, and GitHub link
5. To add an image, put it inside `.project-card__header`:

```html
<article class="project-card" data-category="security">
  <div class="project-card__header">
    <img src="img/your-image.jpg" alt="Screenshot" loading="lazy" onerror="this.style.display='none'">
    <svg class="project-card__header-icon" ...><!-- fallback icon --></svg>
    <span class="project-card__category">Security</span>
  </div>
  <div class="project-card__body">
    <h3 class="project-card__title">Project Name</h3>
    <p class="project-card__desc">What it does and why it matters.</p>
    <div class="project-card__tags">
      <span class="tag">Python</span>
      <span class="tag">Docker</span>
    </div>
    <div class="project-card__links">
      <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">...</svg>
        Source Code
      </a>
    </div>
  </div>
</article>
```

### Add a certification

Copy a `<div class="cert-card">` block and update the badge image, title, issuer, and verify link.

### Add a Credly badge

Add inside the `<div class="certs__badges">` section:
```html
<a class="certs__badge-item" href="CREDLY_URL" target="_blank" rel="noopener noreferrer">
  <img src="BADGE_IMAGE_URL" alt="Badge name" loading="lazy">
  <span>Badge Name</span>
</a>
```

### Add an achievement

Copy an `<div class="achievement-card">` block and update the icon, title, and description.

## Images

Place files in the `img/` directory. The hero photo is `img/img.jpg`. Cert badges are displayed at 40x40px. Project images are displayed at full card width, 160px height, `object-fit: cover`.

## Local Preview

Open `index.html` in any browser. No server or build needed.
