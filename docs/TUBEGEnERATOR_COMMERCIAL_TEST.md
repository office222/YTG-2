# TubeGenerator Commercial — First Real-Video Test

## Purpose

Use the founder's 30-second TubeGenerator commercial as the first real-world creative test for YTG-2. This is a target brief, not a claim that the current simulated Studio can already produce it. Preserve the existing demo while the real rendering path is developed and verified on `feat/real-video-renderer-poc`.

## Creative concept

A polished, playful parody of an upbeat American pharmaceutical TV commercial. The joke is that the creator's tools have hilariously positive "side effects." No actual pills, medicine bottles, doctors, medical promises, or claims that TubeGenerator guarantees views, income, or channel growth.

Keep one consistent adult creator across scenes. Bright, cinematic, colorful-but-believable imagery. Use licensed, user-supplied, or deliberately generated source assets; do not assume a provider will generate moving footage from text. Keep the ending clear and readable.

## Locked 30-second storyboard

| Time | Visual | Narration / audio |
|---|---|---|
| 0–5 sec | Creator at a desk, staring at a video with 11 views; crowded browser tabs; dramatic concern. | Narrator: “Spending too much time building, managing, and worrying about your YouTube channel?” |
| 5–9 sec | Abrupt sunny music change. Same creator runs through a flower field in exaggerated slow motion, like a cheerful pharmaceutical lifestyle ad. | Narrator: “Ask yourself about TubeGenerator.” |
| 9–16 sec | Fast, clean glimpses of niche selection, video draft review, thumbnail, then creator relaxing with coffee. Prefer genuine TubeGenerator UI captures for product screens. | Narrator: “It helps you research, create, publish, monitor, and improve your videos.” This wording must be reviewed against features that are actually live before public release; do not imply unavailable automation is already operational. |
| 16–25 sec | Quick comic montage: creator smiles, closes 27 browser tabs, walks away from the computer, hugs a loved one. | Fast narrator: “Possible side effects may include more free time, fewer headaches, renewed confidence, and an unexplained urge to enjoy your weekend.” |
| 25–30 sec | Clean branded end card with TubeGenerator logo and tubegenerator.com. | Narrator: “TubeGenerator. You decide where you're going. Your AI Army does the work.” |

## Audio direction

- Use an original or properly licensed upbeat bed; no recognizable copyrighted commercial jingle.
- Dramatic concern at the start, abrupt cheerful lift at 5 seconds, then a brisk comic pace.
- Narration must be intelligible and timed to the five scene boundaries.
- The side-effects line should sound deliberately fast, but remain understandable.
- Keep the final brand line clear over a music resolve.

## First technical pass (no unapproved spending)

1. Build a real MP4 from supplied/approved image assets and text overlays using the server-side render provider.
2. Confirm provider configuration remains server-only and secrets never enter browser bundles, logs, or source control.
3. Validate the timeline and display the provider's estimate before any render is submitted.
4. Do not submit a paid render without explicit approval; first confirm the provider account, available free credits, and exact estimate.
5. Verify the finished MP4 can be played and downloaded; record actual cost and any limitations.
6. Keep this first pass distinct from generated video footage, AI voice, music sourcing, and YouTube publishing. Add those only after their providers, cost, and integration paths are verified.
7. Preserve the existing simulated Studio until the real path is proven. Do not label demo progress as a real render.

## Acceptance criteria

- A real, playable, downloadable MP4 exists; a simulated preview is not sufficient.
- Target duration is 30 seconds, with the five scenes aligned to the table above.
- Brand end card is readable and uses the approved logo/site.
- Narration and music are present only if the chosen workflow actually supplies them; otherwise document the gap rather than claiming completion.
- Build/lint results are recorded only after they have actually run successfully.
- No customer credit balance is debited in this prototype. Provider failures must not be represented as successful output.
