# Eslam Wasfi — Portfolio

Bilingual (Arabic / English) portfolio for **Eslam Wasfi — Art Director & AI Creative Director**.
Built with [Astro](https://astro.build) as a static site and published on GitHub Pages.

- Arabic (default, right-to-left): `/ar/`
- English (left-to-right): `/en/`
- Live site: **https://eslamwasfi-sudo.github.io/eslam-portfolio/**

Every change on the `main` branch rebuilds and republishes the site automatically (about 1–2 minutes).

**Easiest way to update the site: the admin panel** (section 0 below). You can also edit the files
directly on github.com (sections 1–6), with no software to install.

---

## 0. Admin panel: لوحة التحكم

Open **https://eslamwasfi-sudo.github.io/eslam-portfolio/admin/** on your phone or computer.

### First time only: create your access key (token)
The panel signs in with a GitHub "personal access token". It works like a password that can only edit this one repository.

1. Sign in to GitHub and open **https://github.com/settings/personal-access-tokens/new**
2. **Token name**: `portfolio admin`. **Expiration**: pick a date (up to one year; you'll make a new key when it expires).
3. **Repository access** → **Only select repositories** → choose **eslam-portfolio**.
4. **Permissions** → **Repository permissions** → **Contents** → **Read and write**.
5. Click **Generate token** and copy the key (it starts with `github_pat_`). GitHub shows it only once.
6. In the admin panel, choose **Sign In Using Access Token**, paste the key, and sign in.
   Your browser remembers you, so you won't need the key again on that device.

**Never share this key or paste it anywhere else.** If you lose it or think someone saw it,
delete it at https://github.com/settings/personal-access-tokens and make a new one.

### Using the panel
- **المشاريع · Projects** → **All projects**: the full list in site order. Use **Add** to add a project at the top,
  open one to edit it, drag to reorder, or remove it. Upload the cover and gallery images straight from your phone.
  Images are resized and converted to WebP automatically before saving.
- **الإعدادات والتواصل · Settings & Contact**: WhatsApp, email, Instagram, Behance, the hero showreel loop,
  and the **Show site on Google** switch.
- Click **Save**. The site updates about 2 minutes later.
- If a save breaks the build (very rare, e.g. a broken image), the live site simply stays on the previous version.
  Check the **Actions** tab on GitHub, or ask for help.

Text that isn't in the panel (About, Services, buttons) lives in `src/i18n/ui.ts` (section 4).

---

## 1. Change your contact links (WhatsApp, email, Instagram, Behance)

Open **`src/data/site.json`** and replace the placeholders:

```json
"contact": {
  "whatsapp": "201000000000",
  "email": "hello@example.com",
  "instagram": "https://www.instagram.com/your-handle",
  "behance": "https://www.behance.net/your-handle"
}
```

- **whatsapp**: your number in international format, **digits only**, no `+`, no spaces.
  Egypt `+20 100 123 4567` → `201001234567`. Saudi `+966 50 123 4567` → `966501234567`.
- The pre-filled WhatsApp message is in `src/i18n/ui.ts` (`whatsappMsg`), with one version in Arabic and one in English.

### Hide the site from Google (temporarily)
In `src/data/site.json`, `"indexing": false` tells Google and other search engines not to list the site.
The site still works for anyone who has the link. Set it to `true` once your real work and contact details are in.

## 2. Add a new project

**Step 1: Add the images.**
Create a folder named after your project in `src/assets/projects/`, for example
`src/assets/projects/my-new-project/`, and put your images in it:

```
src/assets/projects/my-new-project/cover.jpg
src/assets/projects/my-new-project/gallery-1.jpg
src/assets/projects/my-new-project/gallery-2.jpg
```

JPG, PNG or WebP all work. Export at about **2000–2400 px wide**. The site resizes and compresses them
automatically for phones, so you never need to make small versions yourself.
(On github.com: open the folder → **Add file → Upload files**.)

**Step 2: Add an entry to `src/data/projects.json`.**
Copy one existing block `{ ... }`, paste it where you want it in the list, and edit it.
**The order in the file is the order on the site.** Remember the comma between blocks.

```json
{
  "slug": "my-new-project",
  "category": "ai-video",
  "title_en": "My New Project",
  "title_ar": "مشروعي الجديد",
  "client": "Brand Name",
  "year": 2026,
  "cover": "/projects/my-new-project/cover.jpg",
  "video": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "video_file": "",
  "video_poster": "",
  "gallery": [
    "/projects/my-new-project/gallery-1.jpg",
    "/projects/my-new-project/gallery-2.jpg"
  ],
  "description_en": "One or two sentences about the idea and the result.",
  "description_ar": "جملة أو جملتان عن الفكرة والنتيجة.",
  "role_en": "Art direction, AI direction",
  "role_ar": "الإدارة الفنية، إخراج الذكاء الاصطناعي",
  "tools": ["Midjourney", "Runway", "After Effects"]
}
```

| Field | What to put |
|---|---|
| `slug` | The web address of the project: lowercase, hyphens, no spaces (`/en/work/my-new-project/`). Must be unique. |
| `category` | One of: `ai-video`, `campaigns`, `branding`, `3d` (AI Video, Campaigns & Concepts, Graphic Design & Branding, 3D / Previz). |
| `cover` | Path to the cover image **inside `src/assets/`**, e.g. `/projects/my-new-project/cover.jpg`. |
| `video` | A YouTube or Vimeo link (any normal share link works), or `""`. |
| `video_file` | Instead of a link: a short muted loop in `public/videos/`, e.g. `/videos/my-loop.mp4`. Leave `""` if you use `video`. |
| `video_poster` | Optional image shown before the video plays. If left empty, the cover is used. |
| `gallery` | Any number of images, or `[]`. The first image is shown full width. |
| `todo` | Only on the placeholder projects. It shows the orange **TODO** badge. Delete this line on real projects. |

**Step 3: Commit to `main`.** The site updates by itself.

### Replacing the 8 placeholder projects
The site starts with 8 placeholder projects marked **TODO**, two per category.
For each one, either replace its images and text (keep the same image file names to make it easy and delete the `"todo": true` line),
or delete its block from `projects.json` together with its folder in `src/assets/projects/`.

## 3. Videos: important rules

GitHub rejects files over 100 MB, and big files make the site slow. So:

- **Long videos, showreels and films** → upload to **YouTube** (Unlisted is fine) or **Vimeo**, then paste the link into `video`.
  The site shows a lightweight poster with a play button, and the player only loads when someone taps it. This keeps the site fast.
- **Local `.mp4`** → only for **short, silent loops under 10 MB** (about 5–10 s at 720p or 1080p). Put them in `public/videos/`
  and write `"video_file": "/videos/name.mp4"`. They play muted on loop and only start when scrolled into view.
  A safety check (`check-videos.yml`) stops any commit containing a file over 10 MB.

Recommended export for a loop: H.264 MP4, 1280×720 or 1920×1080, no audio, 2–4 Mbps.
With ffmpeg:
```
ffmpeg -i input.mov -t 8 -an -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart public/videos/my-loop.mp4
```

### The hero showreel loop
Replace `public/videos/showreel-loop.mp4` (a placeholder) with your own short silent loop,
and `src/assets/showreel-poster.jpg` with a still frame from it (shown instantly while the video loads).
Both paths can be changed in `src/data/site.json` → `showreel`.

## 4. Edit other text

All the website copy (hero line, About, Services, Contact, buttons) lives in **`src/i18n/ui.ts`**,
with the Arabic version (`ar: { ... }`) first and the English version (`en: { ... }`) below it.

## 5. Social sharing image

When someone shares the link on WhatsApp, Instagram or X, they see **`public/og-image.jpg`** (1200 × 630).
Replace it with your own design at the same size. Project pages use a crop of the project cover automatically.

## 6. Colors and fonts

In `src/styles/global.css`, under `:root`: `--bg` (background), `--text`, and `--accent` (the single warm accent color).
Fonts are IBM Plex Sans Arabic for Arabic and Space Grotesk for English, served from the site itself.

---

## Run it on your computer (optional)

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev      # http://localhost:4321/eslam-portfolio/
npm run build    # production build into dist/
```

`npm run placeholders` regenerates the placeholder images. You won't need it once your real work is in.

## Publishing (one-time setup)

1. On GitHub, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
2. Push or merge to `main`. The **Deploy to GitHub Pages** workflow builds the site and publishes it at
   `https://eslamwasfi-sudo.github.io/eslam-portfolio/`.

**Custom domain later?** (e.g. `eslamwasfi.com`) In `astro.config.mjs` set `SITE = 'https://eslamwasfi.com'` and `BASE = '/'`,
add a file `public/CNAME` containing `eslamwasfi.com`, and set the domain in Settings → Pages.

## Project structure

```
src/data/projects.json   ← your projects (the only file you need for new work)
src/data/site.json       ← contact links + showreel
src/i18n/ui.ts           ← all Arabic & English copy
src/assets/              ← images (auto-optimised)
public/videos/           ← short muted loops only (< 10 MB)
public/og-image.jpg      ← social sharing image
src/components/          ← page sections (Hero, Work grid, About, Services, Contact…)
src/pages/               ← routes: /ar/, /en/, /[lang]/work/[slug]/
```
