# Melange India — Modern Website

A modern, responsive redesign of melangeindia.in. Static site (HTML/CSS/JS) — perfect for **free GitHub Pages hosting**. Includes a Contact / Lead page that auto-detects the lead source (website / Instagram / LinkedIn …) and saves every submission to a **Google Sheet**.

## Files
```
index.html              Home page (hero, about, offerings, clients, team, CTA)
contact.html            Contact / Lead capture page
styles.css              Shared styling (dark luxury theme)
main.js                 Nav, scroll animations, counters, logo fallback
contact.js              Source auto-detection + form submission  ← edit this
google-apps-script.gs   Backend that writes leads to Google Sheets
assets/logo.png         <-- ADD YOUR LOGO HERE (see step 1)
assets/favicon.png      <-- optional favicon
```

---

## Swapping illustrations for real photos (optional)
The hero panel and the six offering cards use original on-brand SVG illustrations in `assets/illustrations/`. To replace any with a real photo, just change the `src` — the styling (cover-fit for the hero, circular badge for the cards) stays the same:

- **Hero panel** → in `index.html`, find `class="frame-img"` and point its `src` to your photo (e.g. `assets/hero.jpg`). It auto-fills the panel.
- **Offering cards** → in `index.html`, each card has `<div class="offer-img"><img src="assets/illustrations/0X-….svg" …></div>`. Swap the `src` to your product photo.

No CSS changes needed.

## Step 1 — Add the logo (kept "as is")
The original logo is hosted on the live WordPress site. Download it and drop it into the `assets/` folder. On your own computer run:

```bash
cd assets
curl -L -o logo.png "https://melangeindia.in/wp-content/uploads/2020/06/companyLogo.png"
curl -L -o favicon.png "https://melangeindia.in/wp-content/uploads/2020/07/cropped-MELANGE_ICON-01-270x270.png"
```

If those URLs ever change, just save the logo from the live site and name it `assets/logo.png`. **If the logo file is missing, the site automatically shows a clean "MELANGE" text wordmark** so nothing ever looks broken.

---

## Step 2 — Connect the Google Sheet (free)
1. Create a Google Sheet, rename the first tab to **Leads**.
2. **Extensions ▸ Apps Script**, delete the sample, paste all of `google-apps-script.gs`, Save.
3. **Deploy ▸ New deployment ▸ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize, then copy the **Web app URL**.
5. Open `contact.js` and paste it:
   ```js
   const SHEET_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
6. (Optional) set `NOTIFY_EMAIL` in the `.gs` file to get an email on every lead.

Leads land in the sheet with columns: **Timestamp, Source, Name, Company, Email, Phone, City, Interest, Message, Page URL**.

---

## Step 3 — How source tracking works
The form auto-fills the **Source** field, no manual selection needed:
- Link from Instagram bio → `https://yoursite.com/contact.html?source=instagram`
- Link from LinkedIn → `?source=linkedin`
- Standard `utm_source=` parameters also work
- If no parameter, it reads the browser referrer (instagram.com, linkedin.com, etc.)
- Falls back to `website`

So just use the right link in each social profile and every lead is tagged correctly.

---

## Step 4 — Add your Google Analytics ID
Both `index.html` and `contact.html` already include the GA4 (gtag.js) snippet near the top of `<head>`. Just swap in your own Measurement ID:

1. In Google Analytics: **Admin ▸ Data Streams ▸** your web stream → copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).
2. In **both** `index.html` and `contact.html`, replace every `G-XXXXXXXXXX` with your real ID (two spots per file).

Bonus: a `generate_lead` GA4 event fires automatically on every successful form submission, tagged with the lead `source` (website / instagram / linkedin …) and the selected `interest` — so you can see conversions and which channel drives them. No extra setup needed.

## Step 5 — Host free on GitHub Pages
1. Create a GitHub repo, upload all these files (keep the structure).
2. Repo **Settings ▸ Pages**.
3. Source: **Deploy from a branch**, Branch: **main** / root, Save.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

To use the custom domain `melangeindia.in` later, add it under Pages ▸ Custom domain and point the domain's DNS to GitHub.

---

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
