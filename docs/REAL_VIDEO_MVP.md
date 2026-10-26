# YTG-2: First Real Video Milestone

Goal: replace the simulated production run with one verified, downloadable MP4 while preserving the existing demo.

## Repository checkpoint
- Repository: office222/YTG-2
- Base commit: d2078a0defef2e28710774f45d6eb45296a07fd1
- Work branch: feat/real-video-renderer-poc
- Do not make changes directly to main.

## Current state
The Video Studio production flow is simulated. Browser object URLs do not provide durable server-side media storage. The app uses TanStack Start and Nitro with a Cloudflare-module target, so provider secrets must remain server-side. The build has not been verified as clean and repeatable.

## First MVP
1. Accept a small set of JPG/PNG images.
2. Validate files and size on the server.
3. Send the assets to a rendering provider using its documented API.
4. Create a real MP4 slideshow with title/caption overlays and transitions.
5. Show actual render status and the real output link; never label simulated progress as a real render.
6. Do not charge YTG-2 credits for provider failures. A production credit ledger is not part of this milestone.
7. Keep provider secrets off the client and out of logs.
8. Preserve the existing demo until the real workflow is proven.
9. Run build/lint checks and record results honestly.

## Provider evaluation
Rendobar Compose is the first candidate to evaluate, not yet an approved dependency. Verify current pricing, upload and rendering API requirements, output retention, commercial terms, and failure billing before integrating. Rendering only assembles supplied assets; scripting and narration are separate costs.

## Out of scope for this first render
AI script generation, paid TTS, YouTube publishing, subscription billing, production accounts, and a production credit ledger.

## Completion test
A real MP4 created from uploaded images can be played and downloaded. Record actual provider cost and quality. Do not declare success until a real render and a repeatable build are verified.
