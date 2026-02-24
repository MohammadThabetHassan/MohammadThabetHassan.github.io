# Mohammad Thabet - Portfolio Site

Personal portfolio deployed via GitHub Pages at [mohammadthabethassan.github.io](https://mohammadthabethassan.github.io).

## Stack

Plain HTML + CSS + vanilla JS. No build step required — GitHub Pages serves `index.html` directly.

## How to Edit Projects

All projects live inside the `<!-- ===== PROJECTS ===== -->` section of `index.html`. Each project is an `<article class="project-card">` block.

### Add a new project

Copy an existing `<article class="project-card">` block and update:

```html
<article class="project-card">
  <!-- Option A: with image -->
  <img
    class="project-card__img"
    src="img/your-image.jpg"
    alt="Description of screenshot"
    loading="lazy"
    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
  >
  <!-- Fallback if image fails -->
  <div class="project-card__placeholder" style="display:none;" aria-hidden="true">
    <svg class="icon" viewBox="0 0 24 24" width="40" height="40" stroke="#33ff99" stroke-width="1.5">
      <!-- pick any feather icon path -->
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  </div>

  <!-- Option B: placeholder only (no image) — remove the <img> and set display:flex on placeholder -->
  <div class="project-card__body">
    <h3 class="project-card__title">Project Name</h3>
    <p class="project-card__desc">One-line impact statement about the project.</p>
    <div class="project-card__tags">
      <span class="tag">Tech1</span>
      <span class="tag">Tech2</span>
    </div>
    <div class="project-card__links">
      <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><!-- GitHub icon --></svg>
        Source Code
      </a>
      <!-- Optional: live demo link -->
      <a href="https://..." target="_blank" rel="noopener noreferrer">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><!-- external link icon --></svg>
        Live Demo
      </a>
    </div>
  </div>
</article>
```

### Remove a project

Delete the entire `<article class="project-card">...</article>` block.

### Add a certification

Copy an existing `<div class="cert-card">` block inside the certifications grid and update the image, title, and verification URL.

## Images

Place project screenshots and cert badge images in the `img/` directory. Recommended size: 800x450px for project images, any size for cert badges (displayed at 48x48px).

## Local Preview

Open `index.html` in any browser. No server or build step needed.
