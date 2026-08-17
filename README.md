# Ashwin R — Portfolio

A single-page portfolio site. Plain HTML/CSS/JS — no build step, no dependencies.

## Files
- `index.html` — page structure & content
- `style.css` — all styling
- `script.js` — terminal typewriter effect, nav toggle, scroll reveal
- `assets/ashwin-photo.jpg` — profile photo
- `assets/Ashwin_R_Resume.pdf` — downloadable résumé (linked from the nav)

## Host it on GitHub Pages (free)

1. Create a new repository on GitHub — name it `ashwin-portfolio` (or anything you like).
   - **Tip:** if you name it `<your-username>.github.io` exactly, the site becomes your root domain (`https://<your-username>.github.io`) instead of a sub-path.
2. Upload these files to the repo (drag-and-drop on GitHub, or via git):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/ashwin-subspace/ashwin-portfolio.git
   git push -u origin main
   ```
3. On GitHub: go to **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
6. Wait ~1 minute. Your site will be live at:
   `https://ashwin-subspace.github.io/ashwin-portfolio/`

## Updating project links later

Each project card in `index.html` links directly to its GitHub repo — edit the `href` in the `<a class="project-link">` tags if a repo is renamed or moved.

## Editing content

- Swap the photo: replace `assets/ashwin-photo.jpg` (keep the same filename, or update the `src` in `index.html`).
- Update the résumé: replace `assets/Ashwin_R_Resume.pdf` with a new export (keep the same filename).
- Add a new project: copy one `<article class="project reveal">...</article>` block in `index.html` and edit its contents.
