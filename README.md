# Aunty Alice College — Premium School Website Demo

A premium website demo and internal admissions portal for Aunty Alice College, Mararaba (motto: *Knowledge is True Wealth*). It was built to show the college a realistic, modern digital presence.

It's a **standalone demo**. It doesn't link to any real school website or portal. The newsletter form and admissions portal are clearly labelled demos, and nothing is sent anywhere.

## Status

All stages are built and QA'd: header, cinematic hero, Philosophy, About, Admissions, Academics, School Life, Campus, Newsletter & Contact, Footer, and the `/admissions` portal. Some content still needs confirming with the school (see `docs/03-qa-report.md`, "Open items").

## Preview locally

From this folder:

```bash
python3 -m http.server 5180 --bind 127.0.0.1
```

Then open http://localhost:5180. The portal is at http://localhost:5180/admissions/.

## Project structure

```
AuntyAlice-premium-demo/
├── index.html              Homepage (all sections)
├── admissions/index.html   Demo admissions portal
├── css/                    One stylesheet per section, plus base.css for design tokens
├── js/                     header, hero video loop, scroll reveal, newsletter, portal
├── assets/
│   ├── logo.png            Official school logo (real brand asset)
│   ├── images/             Generated stills: WebP, with JPEG fallbacks
│   └── video/              Hero video (supplied by the client, unmodified)
├── docs/                   Discovery, asset generation log, QA report (not for publishing)
├── .claude/                Build skill and local preview config (not for publishing)
└── README.md
```

Source material lives outside the site folder, in `../REFERENCE/auntyalice-source-assets/`:

- `school-supplied-reference/`: the school's building and classroom photos. **Reference only — never publish.**
- `image-masters/`: full-quality PNG masters of the six approved stills.
- `generation-takes/`: alternate and rejected generations, plus the original versions from before the uniform edits.

## Deploying

Publish only the site files: `index.html`, `admissions/`, `css/`, `js/` and `assets/`. Leave `docs/`, `.claude/` and `README.md` out of the published site.

## How it was built

The build used the **Premium School Digital Experience Builder** skill at `.claude/skills/premium-school-digital-experience-builder/SKILL.md`. The stage-by-stage decisions are recorded in `docs/`.

## Reference

`../REFERENCE/mcroyal-premium-school-demo/` is the approved MC Royal Schools project. It's the quality benchmark only and is read-only. Don't copy its branding, wording, imagery or layout, and don't modify it.
