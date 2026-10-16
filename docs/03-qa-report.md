# Aunty Alice College — Full-Page QA

Stage 15 of the build. Run on 2026-10-16 against the homepage (`/`) and the admissions portal (`/admissions/`) on a local server.

**Result: all automated checks pass on both pages at all five target sizes, after five fixes.** Four items remain open (listed at the end), mostly content to confirm with the school and deployment hygiene for the final cleanup.

## How it was tested

- An in-page audit script ran at **1440×900, 1366×768, 1024×768, 768×1024 and 390×844**, on both pages.
- On the portal it ran on the landing view and the form view.
- It checked:
  - horizontal overflow and off-screen elements
  - broken images and failed network requests
  - missing `alt` text
  - external links, new-tab links and dead `#anchors`
  - touch targets under 44px
  - heading order and `h1` count
  - duplicate IDs and unlabelled form controls
  - WCAG AA text contrast on solid backgrounds
  - hero sizing against the viewport
- Keyboard tab order and focus visibility were checked with real Tab presses.
- The portal flow was tested end to end in the previous stage, and draft saving was re-checked here.

## Results

| Check | Home | Portal |
|---|---|---|
| Horizontal overflow (5 sizes) | 0px everywhere | 0px everywhere |
| Broken images or failed requests | None | None |
| Console errors | None | None |
| External links / new tabs | 0 / 0 | 0 / 0 |
| Dead in-page anchors | 0 (all 7 targets exist) | n/a |
| "Apply" links | All go to `/admissions` (returns 200) | n/a |
| Headings | One `h1`, no skipped levels | One `h1`, no skipped levels |
| Duplicate IDs / unlabelled controls | None | None |
| Touch targets under 44px | None (after fix) | None (after fix) |
| Text contrast (AA) | All pass (after fix) | All pass |
| Hero fills the viewport below the header | Yes at all 5 sizes; copy and buttons always inside the hero | n/a |
| Hero video | Muted, plays inline, fades at the loop point, skipped by keyboard focus | n/a |

### Keyboard

- Tab order: skip link → brand → nav links → header Apply → hero Apply → hero Discover.
- Every element shows a 2px focus ring.
- The mobile menu traps focus, closes with Escape and returns focus to the toggle (checked in the header stage).

## Fixed during QA

1. **Contrast on the sand Newsletter/Contact band.** The eyebrow and "Start an application" link were 4.1:1. They now use the deeper orange `#96430A`, about 5.7:1.
2. **Footer links were 40px tall.** They're now 44px.
3. **Portal brand link was 43px tall on phones.** It's now 48px.
4. **Focus ring on the dark hero.** The orange ring was hard to see over the video. Inside the hero it's now white.
5. **Portal landing at 1366×768.** "Start Application" was below the fold (bottom at 958px). On short laptop screens the crest and the duplicate step list are now hidden and spacing is tighter, so the button sits at 715px.

## Reduced motion (code-reviewed, not emulated)

The browser pane can't emulate `prefers-reduced-motion`. Each behaviour was checked in the code instead:

- **Hero video:** it's hidden with CSS and the script never calls `play()`. The 8.0s poster shows.
- **Scroll reveals:** the hidden starting state only applies when motion is allowed, and the script reveals everything at once.
- **Other motion:** the hero text rise, scroll cue, button lift and portal step transitions are all gated by `prefers-reduced-motion: no-preference`.

## Performance

| Asset | Size | Notes |
|---|---|---|
| Hero video | 5.7 MB | `preload="auto"`. Pauses when off-screen or the tab is hidden. |
| WebP stills (7) | 68–280 KB each, about 1.2 MB total | Served to all modern browsers |
| PNG fallbacks (6) | 1.5–2.1 MB each | Only download in browsers without WebP support |
| Logo PNG | 168 KB | Shown at about 56px |
| CSS (13 files) + JS (5 files) | About 90 KB total, unminified | No frameworks or dependencies |

## Open items

1. **Images are soft on high-density screens.**
   - The generated stills are 1536px wide and the hero poster is 1280px.
   - On 2× screens, the full-width uses (hero poster, S4 Academics, S6 Campus) are slightly upscaled.
   - Fixing this would mean upscaling the masters, which needs your approval.
2. **Resolved in final cleanup.** The reference photos, takes and PNG masters were moved to `../REFERENCE/auntyalice-source-assets/`, and the PNG fallbacks were replaced with JPEGs. Original finding:
   - `assets/building.png` and `assets/classroom.png` are the real reference photos of the school's students. The brief says they're reference only.
   - `assets/generated/_takes/` holds 11 rejected or backup images, about 23 MB.
   - `docs/`, `.claude/` and `README.md` also sit in the folder.
   - Proposed for the final cleanup stage, and only with your approval: move these out of the deploy root, or exclude them from deployment.
3. **Content still to confirm with the school:**
   - phone and email
   - levels offered and session
   - the drafted interpretive copy (About narrative, the meanings of the crest symbols, level descriptions)
   - the temporary S4 image (one boy wears dark navy trousers)
   - the hero video, where girls wear pinafore-style dresses (it can't be edited here)
4. **Optional optimisations for cleanup:**
   - Swap the PNG fallbacks for JPEGs (about 10× smaller).
   - Make a small WebP of the logo for the header.
