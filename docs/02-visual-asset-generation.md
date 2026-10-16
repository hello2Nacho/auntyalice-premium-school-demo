# Aunty Alice College — Visual Asset Generation

Stage 3 output. Generated against the approved briefs in `01-discovery-and-creative-direction.md`.
Status: **six stills approved by client (2026-10-16); hero video supplied by client (2026-10-16), ready for review**. No website implementation has started.

> **File locations after final cleanup (2026-10-16).** Paths below that point to `assets/generated/_takes/` or to PNG files in `assets/images/` are historical.
>
> - Takes are now in `../REFERENCE/auntyalice-source-assets/generation-takes/`.
> - PNG masters are now in `../REFERENCE/auntyalice-source-assets/image-masters/`.
> - The site ships WebP with JPEG (q82) fallbacks.
> - The school's reference photos are now in `../REFERENCE/auntyalice-source-assets/school-supplied-reference/`.

## Tooling

- Stills: Figma MCP `generate_image`, model `gpt-image-2.5-sunburst`, billed to Figma AI credits. 8 generations in total.
- Working file: [Aunty Alice College — Generated Visual Assets](https://www.figma.com/design/woQXByFEObHuXYGz59n5sQ). It holds every take.
- Video: not available from this environment (Figma Weave isn't linked). The client is generating V1 with their own tool.

## Selected stills (`assets/images/`)

| ID | File | Size | Use | Notes |
|---|---|---|---|---|
| S1 | `s1-learning-detail` | 960×1280 | Educational philosophy | Take 2. Correct bright orange. The neckline trim came out navy/gold stripes, which is a minor deviation from the real multicolour trim. |
| S2 | `s2-teacher-small-group` | 960×1280 | About | Take 1. Blue/grey classroom matches the reference. Hands and faces are clean. |
| S3 | `s3-morning-arrival` | 1536×1024 | Admissions | Take 1. The building closely matches the real block (ochre walls, balconies, blue-glass strip). Green-and-white hem band is correct. |
| S4 | `s4-lesson-in-progress` | 1536×1024 | Academics | Take 1. Blank whiteboard. Raised hands are clean. |
| S5 | `s5-corridor-balcony` | 1536×1024 | School life | Take 2. Take 1 was rejected for a rust-brown uniform. The railing has a slight angle change at the far left, which reads as a balcony corner. |
| S6 | `s6-campus-exterior` | 1536×864 | Campus | Take 1. Faithful to the real building. Crop to 21:9 in CSS if needed. |

Each still exists as a `.png` master and a `.webp` (q82, 115–205 KB).

Rejected takes stay in `assets/generated/_takes/` for reference. They're not for the site.

## Quality gate results

All six selected stills pass the visible checks:

- No legible text, signage, logos or crests.
- Hands and faces checked at 100% on S2, S4 and S5.
- Uniform colours and the green-and-white band are present.
- No American styling, and no added wings or floors on S6.

## Known limitation — resolution

The model outputs about 1.2–1.6 MP, which is below the brief's target of 2000 px or more on the long edge. That's fine for editorial-split and half-width layouts on 1× and most 2× screens. Full-bleed use at 1440 px or wider will look slightly soft. Options:

1. Use the stills mainly in split or framed layouts (recommended; it fits the editorial direction).
2. Upscale the chosen masters with a dedicated upscaler before final build. This needs your approval because it's generative.

## Hero video (V1) — supplied, ready for review

The client generated and supplied the video on 2026-10-16. It's kept exactly as delivered: not renamed, moved, re-encoded or compressed.

| Property | Value |
|---|---|
| File | `assets/video/Creating_school_advertising_video_20261016093358.mp4` |
| Size | 5.8 MB (5,819,653 bytes) |
| Duration | 10 s |
| Resolution | 1280×720 (16:9) |
| Codecs | H.264 video, AAC audio |

Notes for review:

- **Resolution:** 720p is below the brief's 1080p target. It will look slightly soft as a full-viewport hero on large or 2× screens.
- **Audio:** the file contains an audio track. The hero will play muted, so this doesn't affect playback. Removing it would mean re-encoding the file, which needs approval.
### Video review (2026-10-16) — verdict: PASS WITH MINOR ISSUES

**Method.** The MP4 was opened read-only. 21 frames were extracted every 0.5 s (plus the last frame) to a temporary folder outside the project, then inspected at full size and at 2–3× zoom on people, the corners and the planters. The file's SHA-256 is identical before and after the review: it was not modified, re-encoded or replaced.

**Shot.** A slow forward crane/dolly rises past foreground trees toward the two-storey block in hazy golden morning light. Pairs of students cross the compound. This is the brief's **Option C (rising wide)**, not the recommended Option A. Option C was an approved alternate.

| # | Check | Result |
|---|---|---|
| 1 | Visual quality and realism | **Pass.** Believable light, haze, materials and Mararaba-like hills and water tower. Softness comes from 720p, not from artifacts. |
| 2 | Faces, hands, movement, gait | **Pass.** People are small in frame, so faces and hands aren't readable. Gait is natural at normal size. One mid-stride foot at about 10 s looks slightly odd only at 3× zoom. |
| 3 | AI artifacts and distortions | **Pass, minor.** At 7.5–8.5 s a walking pair passes very close behind a planter sapling. It reads as parallax, not as walking through it. No morphing was seen. |
| 4 | Environment realism | **Pass.** Strongly faithful to the reference block: ochre walls, balconies, white railings, white hipped roofs, blue-glass stairwell strip, sandy compound and young trees. |
| 5 | Uniform accuracy and tangerine orange | **Minor issue.** Orange reads as burnt/rust under golden light rather than bright tangerine. Girls wear orange pinafore dresses and some boys appear to wear shorts. Neither is confirmed by the reference, which shows trousers. Berets and pale-yellow shirts are correct. Impact is low because the figures are small. |
| 6 | Railings, desks, windows, architecture | **Pass.** Railings, columns, windows and rooflines stay straight and consistent across all frames. No desks are in this shot. |
| 7 | Camera movement and cinematic quality | **Pass.** Smooth, steady, restrained and premium. Foreground trees give depth. |
| 8 | Works as an immersive hero | **Pass.** The large calm sky in the upper area suits the headline overlay. It needs a restrained overlay for text contrast. |
| 9 | 9:16 mobile crop | **Pass.** A centre crop (405×720 source px) keeps the stairwell bay and the walking students in frame at start, middle and end, with sky above for text. Use `object-position` of about 55% 50%. Expect extra softness on phones, because 720 px of height is scaled up. |
| 10 | Clean loop | **Minor issue.** The camera finishes much closer than it starts, so a hard loop shows a visible jump. Handle it in implementation without touching the file, for example with a short fade at the loop point. |
| 11 | Text, watermark, logos | **Pass.** No text, signage, watermark or logo in any inspected frame or corner. |
| 12 | 10 s duration | **Pass.** Matches the brief's 8–10 s target. |

**Poster frame (V1-P).** Use **8.0 s**. It shows the full building with the blue-glass stairwell bay central, clean sky for the headline, two pairs of students mid-stride with good spacing, and no foreground clutter. Because the video starts at the wider 0 s view, use a short fade from poster to video so the change doesn't read as a jump. If you'd rather have a seamless start than the strongest image, use the **0 s** frame instead. The poster will be extracted as a separate still at implementation, and the video itself is untouched.

**Open item for client.** Confirm the girls' and boys' lower garments (pinafore or trousers, shorts or trousers). If the video's uniform is wrong, regenerate with the corrected uniform description.

**Ready for website implementation**, with these notes: the loop is handled by a fade, the poster is the 8.0 s frame, the video plays muted, and the 720p limit applies.

### Original generation brief

- Use **Option A** (corridor balcony dolly) from `01-discovery-and-creative-direction.md` §8, with the shared blocks pasted in.
- Add this to the prompt: *"bright vivid tangerine-orange uniforms, not rust or brown; neutral white balance"*. The stills drifted toward rust without it.
- S3 and S5 are good visual references for the look if your tool accepts an image reference.
- Delivery: drop the MP4 into `assets/video/`.
- I'll then extract the V1-P poster frame, check it against the quality gate, and encode web versions.

## Uniform correction — girls wear orange skirts (2026-10-16)

The client confirmed, with a new school group photo as reference, that girls wear **orange skirts**, not trousers or pinafores. Boys are unchanged.

### Affected assets

| Asset | Issue | Priority |
|---|---|---|
| S3 `s3-morning-arrival` (Admissions) | Girl in beret clearly wears orange trousers | Requested first |
| S5 `s5-corridor-balcony` (not yet used) | Two girls in berets clearly wear orange trousers | High |
| S2 `s2-teacher-small-group` (About) | Girl's lower garment mostly hidden by the desk; orange trousers visible under it | Low |
| S4 `s4-lesson-in-progress` (not yet used) | Girls seated, seen from behind; lower garments barely visible | Low |
| V1 hero video | Girls wear orange pinafore dresses | Can't be edited here |

S1 and S6 aren't affected.

### S3 — corrected (2026-10-16)

The client edited S3 in their own tool and supplied it in chat. It replaces `assets/images/s3-morning-arrival.png` and `.webp`: 1639×959, WebP q82, 223 KB. The original trousers version is kept at `assets/generated/_takes/S3-take1.png` for rollback.

Check at full size:

- Knee-length pleated orange skirt with realistic folds, and white socks.
- Face, beret, shirt, vest, backpack, hand and pose are unchanged. The mother, boys, building and light are unchanged.
- No text or logos.

Notes:

- The vest's green-and-white hem band is now hidden at the skirt waist. It's a minor difference, and the vest itself is unchanged.
- The edit is framed slightly tighter than the original (1.71:1 instead of 1.5:1). It crops well in the Admissions section at 1440 and 390 wide. The `<img>` width and height attributes were updated to match.

### S5 — corrected (2026-10-16)

The client's edit replaces `assets/images/s5-corridor-balcony.png` and `.webp`: 1536×1024 (same framing as before), WebP q82, 117 KB. The original is kept at `assets/generated/_takes/S5-take2.png`.

Check at full size:

- Both girls in berets now wear pleated orange skirts with natural folds.
- Both boys still wear orange trousers.
- Faces, hands, poses, railing, walls and light are unchanged.

As with S3, the green-and-white vest hem band on the girls is now hidden at the skirt waist. S5 isn't on the page yet; it's planned for School Life.

### S2 — corrected (2026-10-16)

The client's second edit replaces `assets/images/s2-teacher-small-group.png` and `.webp`: 1086×1448 (same 3:4 ratio), WebP q82, 157 KB. The original is kept at `assets/generated/_takes/S2-take1.png`.

- The girl now wears a pleated orange skirt with white socks.
- Both boys keep their orange trousers. The teacher, desk, book and room are unchanged.
- The edit re-rendered the frame slightly. It's framed about 10% tighter, faces are very close to the original but not pixel-identical, and a few background students changed (one more girl in a beret on the right).
- Accepted as a minor drift. Your first S2 edit, which turned the boys into girls, was not used.

### S4 — edit not accepted (2026-10-16)

Both client edits failed the "boys unchanged" rule:

- **First edit:** every student was turned into a girl in a beret.
- **Second edit:** the smiling boy by the window now wears **dark navy trousers** instead of orange, which is an invented uniform. Students were also rearranged: a beret was removed from one girl, one was added to another, and the desk rows shifted.

- **Third edit:** the boy by the window now wears an **orange pleated skirt**, and the teacher's navy trousers became **orange**.

**Client decision (2026-10-16): use the second edit for now.** It's now `assets/images/s4-lesson-in-progress.png` and `.webp` (1536×1024, WebP q82, 149 KB). Its source is kept at `_takes/S4-edit2-interim.png`, the original at `_takes/S4-take1.png`, and the third edit at `_takes/S4-edit3-skirts-rejected.png`.

Known issue: one boy wears dark navy trousers instead of orange. Replace this image once a clean edit is available.

**Recommended fallback:** use the original S4 cropped to its upper part in the Academics layout (a wide crop, roughly 21:9, anchored toward the top). That keeps the raised hands, teacher and whiteboard and leaves out the seated students' laps, so no lower garments show. No editing is needed. Still affected: S4 (planned for Academics) and the hero video (can't be edited here).

### Earlier status

**Blocked: no image-editing tool is available in this environment.** The change has to keep faces, poses, lighting and composition exactly as they are. That needs an edit model that takes the existing image as input:

- Figma `generate_image` is text-to-image only. Regenerating would change faces and composition, which the brief rules out.
- Figma Weave, which provides edit models, isn't linked to the client's Figma account yet.

### Edit instruction (for any image-edit model, with the existing still as input)

```
Edit this photo. Change ONLY the lower garment of the girl(s) wearing the orange beret: replace the orange trousers with a knee-length orange school skirt in the same orange as the uniform vest, with a few soft pleats and realistic cotton-twill fabric folds that follow her stride, and natural legs with white ankle socks and black school shoes below. Keep everything else pixel-identical: her face, skin tone, hair, beret, pale-yellow shirt, orange vest with the green-and-white band, backpack, pose and proportions; the boys' orange trousers; the mother, the building, the compound, the lighting and the framing. No text, logos or badges.
```

For S5, change "the girl(s) wearing the orange beret" to "the two girls wearing orange berets". Everything else stays the same.

## Not generated (by design)

C1 (nursery), C2 (ICT) and C3 (sport) remain blocked until those facts are confirmed.
