# Arciom — site build

## Files

```
site.css            Shared stylesheet (linked by every page)
sitemap.xml         Indexable pages only
robots.txt
og-image.png        1200x630 social card
index.html          Homepage
why-arciom.html     Why Arciom (comparison / objections)
about.html          About + leadership
faq.html            FAQ (24 questions, 4 categories)
request-a-demo.html Demo request form
privacy.html        Privacy Policy (placeholder — needs legal copy)
terms.html          Terms of Service (placeholder — needs legal copy)
about-linked.html   Same page, referencing team/ instead of embedded images
team/               Headshots, 320x320 progressive JPEG
README.md           This file
```

Open `index.html` — all four pages interlink.

All internal links resolve. Nothing 404s.

## Wiring the demo form

`request-a-demo.html` has `action="#"` on the form — a deliberate placeholder.

While the action is `#`, the page validates the form and shows the success state
inline so the flow can be reviewed. **Point the action at a real endpoint**
(Formspree, HubSpot, a custom handler) and it submits normally instead — the
script checks for the placeholder and steps aside. Validation still runs either way.

Field names posted: `name`, `email`, `company`, `role`, `spend`, `managed_by`,
`interest` (0–4 values), `notes`.

The page is `noindex,follow` — a form page shouldn't compete in search results.

## Open items

**Legal — blocking**
- `privacy.html` and `terms.html` are structural placeholders only. Both carry an
  amber "do not publish in current state" notice, matching the instruction in the
  copy doc. Body copy must be drafted with counsel before launch.

**Content**
- About: `Doug` (Head of Product) and `Jason` (AI/Technical Advisor) are placeholder
  cards — need last name, bio, headshot. Marked with dashed borders and
  `<!-- PLACEHOLDER -->` comments in source.
- Why Arciom: "certified team" / "credentialed fix" — name the actual credential
  if there is one.
- FAQ: 6 answers marked `<!-- LEGAL REVIEW REQUIRED before launch -->`
  (twin ownership on departure, and all 4 Data & Ownership answers).

**Assets**
- `team/vincent-peppe.jpg` was upscaled from a 245px source — replace if a
  larger original exists.

**Links**
- Nav `Login` → `#`
- Footer social icons → `#`
- Footer contact is `hello@arciom.com` (carried from the old site, unverified)

## CSS architecture

`site.css` holds the 30 KB shared by every page (tokens, reset, nav, buttons,
sections, footer, focus states). Each page links it, then adds its own `<style>`
block for page-specific rules — so page CSS always overrides shared CSS.

Total CSS went from 350 KB duplicated to 30 KB cached once plus ~101 KB
page-specific. Edit shared rules in one place.

**Rules deliberately left inline:** a handful of type-scale overrides
(`.hero.short h1`, `.qa summary`, `.stp h4`, `:root`) exist in both shared and
page-specific form. Extracting them would have reordered the cascade, so they
stay inline where they resolve correctly.

## Behaviour

- Animation respects `prefers-reduced-motion` throughout.
- All scroll-triggered reveals are guarded behind a `.js` class — with JavaScript
  disabled, content renders in its final visible state rather than staying hidden.
- FAQ accordions are native `<details>`/`<summary>`; they work without JS and are
  searchable with browser find-in-page.

## Note on `about.html` headshots

`about.html` has the six headshots **embedded as base64 data URIs**, so the page
renders correctly on its own with no sibling folder required.

`about-linked.html` is the same page referencing `team/*.jpg` instead. Use that
one in production — it is 72 KB versus 207 KB, and lets the browser cache the
images separately. Rename it to `about.html` when you deploy.
