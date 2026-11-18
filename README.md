# Wolfgang e-Sports: Website

The official website for **Wolfgang e-Sports** (Sri Lanka). It's built with Next.js (App Router), Tailwind CSS v4, shadcn/ui and Framer Motion on the Nemesis theme, recoloured black and white with a HUD-style gaming look. It's ready to host on **Vercel**.

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero, the record, headline titles (photo grid), explore, latest stories |
| `/about` | Story, what Wolfgang did, values, timeline |
| `/achievements` | Every result, with game tabs, a placement filter and search (`?game=valorant` works) |
| `/merch` | Official merch: coming soon |
| `/blog`, `/blog/[slug]` | Stories |
| `/contact` | Email, Instagram, Facebook and contact form |
| `/apply` | **Recruitment form** for individual players and existing teams |
| `/admin` | **Admin** (username and password): blog posts, plus the **Applications** inbox with CSV download |

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000. To use the blog admin locally, sign in at http://localhost:3000/admin with the credentials in `.env.local`. That file is created for local use only and is never committed.

## Deploy to Vercel

1. Push this folder to a GitHub repository and import it in Vercel (**Add New → Project**). Keep the detected defaults.
2. **Connect a Blob store** (this is where blog posts and images are saved):
   Vercel → your project → **Storage** → **Create** → **Blob** → connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Add environment variables** (Settings → Environment Variables):
   - `ADMIN_USERNAME`: the login name for `/admin`
   - `ADMIN_PASSWORD`: a long, unique password
   - `AUTH_SECRET`: a long random string, e.g. the output of `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL`: `https://wolfgangesports.com`
   - optional: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`, so the contact form emails you directly
4. Redeploy. Then visit `https://your-domain/admin` and sign in.

`.env.example` lists every variable.

## Publishing blog posts

Go to **/admin**, sign in and click **New post**.

- Write in Markdown and switch to **Preview** to check it.
- Upload a cover image (max 4 MB) or paste an image URL.
- **Save draft** keeps it hidden from the site. **Publish** puts it live within a few seconds.
- Edit or delete any post from the dashboard.

Where posts are saved:

| Where the site runs | Storage |
| --- | --- |
| Vercel with a Blob store | Vercel Blob (posts as JSON, images as files) |
| Your computer (`npm run dev`) | `content/posts/*.md` and `public/uploads/`. Commit them to publish via Git |

The Markdown files in `content/posts/` always ship with the site. A post saved from the admin with the same URL replaces it, and deleting one from the admin hides it.

## Player & team applications

The **/apply** page first asks whether someone is applying as an **Individual Player** or an **Existing Team**, then shows the rest of the form (the Team section only appears for teams). Progress is saved in the applicant's browser until they submit.

Submitted applications appear in **/admin → Applications**:

- Filter by type and game, and click an application to see every answer (with a WhatsApp button).
- **Download CSV** exports the applications currently shown (all of them, or just the filtered ones). It opens in Excel or Google Sheets.
- Delete applications you no longer need.

Where applications are saved:

| Where the site runs | Storage |
| --- | --- |
| Vercel with a Blob store | Private files in Vercel Blob (`applications/`), readable only by the site |
| Your computer (`npm run dev`) | `data/applications/*.json` (git-ignored, so applicants' details are never committed) |

All the questions are defined in one place, `src/lib/apply.ts`. Editing a question there updates the form, the checks, the admin view and the CSV together.

## Editing content

| What | Where |
| --- | --- |
| Name, slogan, email, Instagram, Facebook, navigation | `src/lib/site.ts` |
| Results (counters, headline titles, achievements page) | `src/lib/achievements.ts` |
| Headline titles shown on the home page (and their photos) | `HEADLINES` in `src/app/page.tsx` |
| Merch page and T-shirt image | `src/app/merch/page.tsx`, `public/images/merch-tshirt.webp` |
| Images | `public/images/` |
| Colours and gaming effects | `src/app/globals.css` |

## Performance notes

- The background dot field draws its static grid once and only animates the dots near the cursor. It stops completely when nothing is moving.
- Glows use gradients instead of blur filters, and there's only one animated canvas per page.
- Motion is switched off for visitors who choose "reduce motion".

## Structure

```
src/
  app/                 routes, layout, page transition, API routes, sitemap, robots
  app/admin/           blog admin (login, dashboard, editor)
  app/apply/           player & team application form
  app/api/apply/       receives applications
  app/api/admin/       admin API: login, logout, posts, image upload, applications (delete, CSV export)
  components/          ui (shadcn), site, home, admin, motion
  lib/                 site config, achievements, posts, post storage, auth
  middleware.ts        protects /admin and /api/admin
content/posts/         Markdown posts
public/images/         photos and logos
archive/               earlier versions of this site (safe to delete)
```
