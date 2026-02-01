# Portfolio Repository Guide

This repository is a static site with Markdown-driven content. The HTML layout stays stable, while most text and images live in `.md` files under the `content/` folder. This keeps edits fast and scalable.

## Project structure

- `index.html` – layout and section placeholders (do not put content here)
- `styles.css` – global styles
- `script.js` – navigation, Markdown loading, gallery effects
- `content/`
  - `academic/` – academic section Markdown
  - `ds/` – data science section Markdown
  - `shared/` – shared content (contact)
  - `assets/` – images and other media

## Edit text (recommended workflow)

1. Find the section you want to edit in `content/`.
2. Modify the corresponding `.md` file.
3. Save and refresh the browser.

Examples:
- Academic About: `content/academic/about.md`
- Data Science About: `content/ds/about.md`
- Contact: `content/shared/contact.md`

## Add or edit images

1. Put the image file in `content/assets/`.
2. Reference it in Markdown.

Recommended Markdown syntax:
```
![Alt text](content/assets/your-image.jpg)
```

If you are editing a file inside `content/academic/` or `content/ds/`, you can also use a relative path:
```
![Alt text](../assets/your-image.jpg)
```

## Academic and Data Science galleries

Both home pages support a scroll-reveal gallery.

- Academic gallery: `content/academic/gallery.md`
- Data Science gallery: `content/ds/gallery.md`

Each image and paragraph pair is parsed into a card. Use this structure:
```
![Title](content/assets/image-1.jpg)

Short description of the image.

---

![Title](content/assets/image-2.jpg)

Short description of the image.
```

## Add a new section (best practice)

1. Create a new Markdown file in the right folder (e.g. `content/academic/new-section.md`).
2. Add a new `<section>` placeholder in `index.html` with a `data-md` attribute pointing to the file.
3. Add a navigation link that calls `showSection('your-section-id')`.

Minimal example to paste into `index.html`:
```
<section id="new-section" class="section-content">
  <h2>New Section Title</h2>
  <div class="md-content" data-md="content/academic/new-section.md"></div>
</section>
```

Then add a nav link (inside the Academic or Data Science menu):
```
<li><a href="#" onclick="showSection('new-section')">New Section</a></li>
```

## Best strategy for future work

- **Keep content in Markdown**: edit only `.md` files for text and images.
- **Keep layout in HTML**: edit `index.html` only when adding/removing sections.
- **Keep effects in JS/CSS**: update `script.js` and `styles.css` only for behaviors or styling.
- **Use `content/assets/`** for all images to keep paths consistent.
- **Small, frequent edits**: each section is isolated, so you can change one page without touching the rest.

If you want, I can also add a template for new sections or an “index” of all `.md` files.
