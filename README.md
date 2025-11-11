# KVL — Single Page Site

This repo contains a single static page that shows **KVL** centered on the screen.

## Files
- `index.html` — the page
- `.nojekyll` — disables Jekyll on GitHub Pages so the site serves as-is

## Deploy on GitHub Pages

### Option A — User/Org site
1. Create a new repository named **`<your-username>.github.io`**.
2. Upload `index.html` and `.nojekyll` to the root of the repo.
3. Push to `main` and visit `https://<your-username>.github.io`.

### Option B — Project site
1. Create any repo name you like (e.g., `kvl-site`).
2. Upload the files to the root of the `main` branch.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose **Branch: `main`**, **/ (root)** and click **Save**.
6. Your site will be available at the URL shown in the Pages panel.

---

If you want a custom domain later, add a `CNAME` file with your domain and configure DNS to point to GitHub Pages.
