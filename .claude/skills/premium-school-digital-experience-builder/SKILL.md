---
name: premium-school-digital-experience-builder
description: Build premium, reusable school website demos and internal admissions portals for schools that lack a modern website. Use when the user gives a school name, logo, photos, uniform references, brochures, website information, or asks to create a school demo. Work section-by-section, preserve verified school facts, generate premium replacement imagery when appropriate, create a cinematic hero, build a reusable admissions demo, enforce responsive/accessibility QA, and never send demo visitors to the school's real website or portal unless explicitly instructed.
---

# Premium School Digital Experience Builder

## Mission

Turn a school's available identity, public information, and supplied assets into a premium institutional website demo that can be shown to the school owner as a realistic proposal.

The quality benchmark is the approved MC Royal Schools project, but never copy MC Royal branding, wording, imagery, or layout mechanically. Reuse the methodology and quality standard, then adapt it to each school.

The finished demo should communicate trust, educational excellence, warmth, institutional credibility, modernity, premium positioning, and clear admissions intent.

Avoid generic SaaS dashboards, cheap school templates, fake claims, and decorative clutter.

## Default Workflow

When the user says “Build a premium demo for [SCHOOL]”, infer the workflow without requiring the user to repeat the methodology.

Recommended stages:

1. Discovery and fact extraction
2. Brand extraction
3. Asset audit and image-generation plan
4. Header/navigation
5. Cinematic hero
6. Educational philosophy / How We Learn
7. About / institutional identity
8. Admissions
9. Academics
10. School Life
11. Campus / environment / facilities
12. Newsletter
13. Footer
14. Internal admissions portal
15. Full-page QA
16. Final cleanup

Build one major stage at a time. After each stage, implement, test, visually inspect, report, and stop for approval unless the user explicitly asks to continue.

## 1. Discovery and Fact Control

Inspect supplied files, screenshots, brochures, prospectuses, public information, and an existing website only when the user asks to inspect it.

Classify information as:

- VERIFIED — directly supported by supplied/reliable material.
- INFERRED — design interpretation that does not create a new factual claim.
- UNKNOWN — information that must not be invented.

Never fabricate awards, accreditations, rankings, exam results, student counts, history, university destinations, facilities, fees, deadlines, staff qualifications, partnerships, testimonials, statistics, or “best/leading/number one” claims.

Preserve authentic school wording when available. Improve presentation before changing facts.

## 2. Brand Extraction

Inspect the school's logo, crest, uniform, signage, photography, stationery, and supplied materials.

Derive:

- primary colour
- secondary colour
- accent colour
- light background
- dark text
- muted text
- borders
- buttons
- typography direction
- radius language
- image treatment

Never force MC Royal colours onto another school.

MC Royal's palette is only a reference example:

- #6B3E8C
- #8663A6
- #F8F4FC
- #C99738
- #0F172A
- #475569

Use accent colours sparingly.

## 3. Central School Configuration

Where compatible with the existing architecture, keep school identity in one configuration source.

Conceptual structure:

```js
const school = {
  name: "",
  shortName: "",
  motto: "",
  logo: "",
  primaryColor: "",
  secondaryColor: "",
  accentColor: "",
  lightBackground: "",
  darkColor: "",
  location: "",
  phone: "",
  email: "",
  levels: [],
  session: "",
  educationalPhilosophy: "",
  admissions: {},
  assets: {}
};
```

Do not over-engineer. Respect the existing framework.

## 4. Asset Audit

Before using imagery, identify what each asset represents, its quality, and whether it should be preserved or replaced.

Do not duplicate files unnecessarily.

If an important image is low-resolution, create a premium replacement rather than stretching it.

## 5. Premium Image Generation

Replacement images should preserve the meaning/composition of the reference while avoiding identifiable copying of real people.

Target:

- high-end editorial photography
- realistic Nigerian/African context where appropriate
- natural lighting
- realistic students
- realistic school architecture
- authentic uniform colours
- documentary quality
- natural skin tones

Avoid plastic AI faces, impossible architecture, generic luxury interiors, fake awards, fake signage, fake school names, and excessive filters.

### Logo rule

Never generate a school's crest or exact logo from imagination.

Use the actual supplied logo asset, or leave signage unbranded.

## 6. Website Structure

Adapt this structure to the school's real content:

- Header
- Cinematic Hero
- Educational Philosophy
- About
- Admissions
- Academics
- School Life
- Campus/Facilities
- Newsletter/Contact
- Footer

Do not force sections that lack supporting information.

## 7. Header

Create a premium institutional navigation system.

Desktop may include logo, school name/motto, Home, About, Academics, School Life, Admissions, Contact, Portal if appropriate, and Apply Now.

Mobile uses logo plus accessible menu.

Parent navigation items should work as navigation targets while dropdowns remain usable on touch and keyboard.

## 8. Cinematic Hero

Prefer a premium cinematic hero when suitable.

Video should normally use:

- about 10 seconds
- autoplay
- muted
- playsinline
- loop
- object-fit: cover
- poster/fallback
- responsive object-position

The hero should fill the available viewport beneath the header using a viewport-safe height calculation such as:

```css
min-height: calc(100svh - var(--header-total-height));
```

Avoid white gaps, letterboxing, horizontal overflow, and face cropping.

Use restrained overlays and preserve natural colours.

Typical hierarchy:

- eyebrow
- headline
- supporting statement
- primary CTA
- secondary CTA
- scroll cue

## 9. Educational Philosophy

Use a quiet editorial section after the cinematic hero.

Prefer:

- generous whitespace
- soft neutral background
- restrained brand accent
- strong typography
- hairline dividers
- numbered principles

Avoid generic SaaS cards.

Only use school principles supported by evidence.

## 10. About

Preferred pattern:

- asymmetric editorial split
- institutional narrative
- premium school image
- evidence-based pillars
- subtle caption
- understated story CTA

Do not use generic stock imagery when school-specific imagery is available.

## 11. Admissions

Make admissions prominent but trustworthy.

Use real admission information only.

Typical structure:

- premium campus/student image
- admissions eyebrow
- heading
- authentic copy
- Apply CTA
- Admission Process CTA

If the school has an external application portal but the user is building a standalone demo, do not link to it.

## 12. Academics

Use the school's real academic structure.

Possible categories include Early Years, Kindergarten, Primary, Secondary, College, and Curriculum only when supported.

Use editorial navigation, tabs, structured lists, or refined panels rather than generic SaaS cards.

## 13. School Life

Where supported, structure around Activities, Sports, Music, Clubs, Student Leadership, Community, and Environment.

Do not claim unsupported activities.

## 14. Campus / Facilities

Use premium architectural/editorial imagery for verified facilities.

Possible subjects: exterior, entrance, classroom, library, laboratory, playground, courtyard, sports area.

Do not fake signage or facilities.

## 15. Newsletter

Keep it simple.

If there is no backend:

- validate email
- clearly identify demo behaviour
- never imply a real subscription
- do not send mail without explicit implementation
- local demo state is acceptable

## 16. Footer

Include real school identity and verified contact information.

For standalone demos, default to no external school links.

## 17. Standalone Demo Link Policy

This is a core rule.

When building a demo for a school that lacks a modern website, do not connect visitors to the school's real website or portal unless explicitly instructed.

Default:

- Home → /
- About → internal section
- Academics → internal sections
- School Life → internal sections
- Admissions → internal section
- Apply Now → /admissions
- Portal → internal demo portal
- Contact → internal footer

Do not open new tabs unless explicitly requested.

## 18. Internal Admissions Portal

Every school demo should be capable of having an internal premium admissions experience at:

`/admissions`

The portal inherits the school's configuration.

Landing screen:

- logo
- school name
- motto
- Admissions label
- Begin Your Application
- session
- levels
- estimated completion time, clearly framed as a demo
- Start Application
- Back to Website

Do not invent fees or deadlines.

### Multi-step flow

1. Student
2. Parent / Guardian
3. Academic
4. Documents
5. Review

Student fields should be sensible and minimal.

Parent/guardian fields should be appropriate.

Academic fields should reflect the school's actual levels.

Documents should have realistic upload UI but must never pretend files reached the school.

Review must allow editing.

Submission should show a clearly demonstrational success state, e.g. `DEMO-2026-0001`.

Never imply a real application was submitted.

Use local state/localStorage where useful and provide Start New Application.

## 19. Portal Design

The portal must not look like a generic government form or SaaS dashboard.

Use strong typography, spacious layout, refined form fields, subtle borders, a polished progress indicator, restrained brand colour, clear hierarchy, and calm transitions.

Touch controls should be at least 48px.

## 20. Responsive Design

Always test:

- 1440 × 900
- 1366 × 768
- 1024 × 768
- 768 × 1024
- 390 × 844

Check zero horizontal overflow, clipping, image crops, typography, navigation, touch targets, button wrapping, and sticky-header offsets.

Design mobile intentionally.

## 21. Accessibility

Ensure semantic HTML, labels, heading hierarchy, keyboard navigation, visible focus, adequate contrast, accessible errors, logical tab order, no keyboard traps, and reduced-motion support.

Use reduced-motion rules appropriate to the existing project.

Do not make informational content keyboard-focusable merely for visual effects.

## 22. Motion

Use motion to communicate hierarchy:

- image reveals
- fade-up copy
- subtle scale
- progress transitions
- hover rule animations
- gentle CTA movement

Avoid aggressive parallax, constant floating, long animations, and distracting transitions.

Typical duration: 0.3–0.6 seconds with elegant easing such as `cubic-bezier(0.16, 1, 0.3, 1)`.

## 23. Typography

Choose typography appropriate to the school's identity.

A premium direction may combine a refined display face with a clean sans-serif, but do not automatically reuse the MC Royal font combination.

Keep font families controlled and consistent.

## 24. Visual Quality

Avoid:

- generic templates
- excessive rounded cards
- heavy shadows
- fake statistics
- neon gradients
- cartoon illustrations
- generic 3D icons
- random stock photos
- fake logos
- fake signage
- overuse of brand colour
- excessive animation
- crowded layouts

Prefer:

- whitespace
- typography
- photography
- composition
- restrained borders
- subtle depth
- strong alignment
- clear hierarchy

## 25. Code Rules

Before changing files:

1. inspect project structure
2. identify framework
3. identify existing components/styles/scripts
4. identify navigation
5. identify asset paths
6. avoid unnecessary dependencies
7. reuse existing infrastructure

Do not rebuild from scratch.

Do not modify approved sections unless required by the current task.

Keep section-specific styles/scripts modular where practical.

## 26. QA Protocol

After each stage, test:

### Functional
- no JS errors
- no broken assets
- buttons work
- navigation works
- forms validate
- mobile menu works
- dropdowns work
- anchors work

### Link audit
For a standalone demo:

- zero unintended external school links
- zero accidental new-tab links
- Apply buttons → /admissions
- internal links point to real sections

### Visual
Inspect all five target widths for spacing, typography, image quality, cropping, CTA sizing, footer, and mobile composition.

### Accessibility
Check heading order, focus, keyboard navigation, touch targets, contrast, and reduced motion.

### Performance
Inspect oversized images/video, duplicated assets, and unnecessary dependencies.

Do not destructively replace or re-encode supplied media without user approval when it materially changes assets.

## 27. Reporting

After each stage report:

### Completed
What was built.

### Files
Created and modified.

### Verification
Viewports, overflow, functional, and accessibility results.

### Remaining
Only genuine unresolved issues.

Then stop for approval unless explicitly instructed to continue.

## 28. New School Conversion

When another school is requested:

1. create school configuration
2. inspect identity
3. audit assets
4. map verified content
5. derive palette
6. plan imagery
7. build the same quality of experience
8. create internal admissions demo
9. QA independently

A previous school is a quality reference, never a content source.

## 29. Command Interpretation

“Build a premium demo for [school]” → start discovery and brand extraction.

“Continue” / “Approved” → proceed to the next stage.

“Use their existing website” → inspect it and preserve factual structure/content while upgrading presentation.

“They don't have a website” → use available supplied/public material and build a standalone demo with no external school links.

“Use their logo/uniform” → treat them as identity references.

“Make the images premium” → generate/recommend high-resolution school-specific replacements; never invent logos.

“Make it like the MC Royal one” → use MC Royal as a quality/methodology reference only, never clone its branding/content.

## Final Principle

The user should only need to:

**Choose school → provide materials → approve stages → present demo.**

The skill should handle:

**Research → interpret → brand → plan assets → generate premium imagery → implement → test → refine → stop for approval.**

Never trade factual integrity for visual polish.
Never trade usability for visual novelty.
Never trade school identity for a reusable template.
