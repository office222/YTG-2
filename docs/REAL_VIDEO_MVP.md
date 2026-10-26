# YTG-2: First Real Video Milestone

Goal: replace the simulated production run with one verified, downloadable MP4 while preserving the existing demo.

## Repository checkpoint
- Repository: office222/YTG-2
- Base commit: d2078a0defef2e28710774f45d6eb45296a07fd1
- Work branch: feat/real-video-renderer-poc
- Do not make changes directly to main.

## Current state
The Video Studio production flow is simulated. Browser object URLs do not provide durable server-side media storage. The app uses TanStack Start and Nitro with a Cloudflare-module target, so provider secrets must remain server-side. The build has not been verified as clean and repeatable.

The Settings route is currently a placeholder, not a provider-configuration screen. Do not assume it can accept API keys or use browser storage for secrets. The first render should use a protected deployment/server environment binding once its exact access pattern is verified for this runtime. No secret name or runtime API should be guessed.

A preliminary server-only Rendobar adapter exists at `src/lib/server/rendobar.ts`. It supports provider-side Compose validation, job submission, and job-status retrieval. It is not yet wired into a route or the Video Studio, and has not been build-tested. It does not upload browser files, persist job records, authenticate users, or debit customer credits.

## First MVP
1. Accept a small set of JPG/PNG images.
2. Validate files and size on the server.
3. Upload assets using the provider's documented flow, or securely store them at URLs the provider can access.
4. Use the adapter to validate the timeline and display the provider's estimate before the user approves a render.
5. Create a real MP4 slideshow with title/caption overlays and transitions.
6. Show actual render status and the real output link; never label simulated progress as a real render.
7. Do not charge YTG-2 credits for provider failures. A production credit ledger is not part of this milestone.
8. Keep provider secrets off the client and out of logs.
9. Preserve the existing demo until the real workflow is proven.
10. Run build/lint checks and record results honestly.

## Provider evaluation
Rendobar Compose is the first candidate to evaluate, not yet an approved production dependency. Its public site currently lists $0.04 per finished video minute, billed by the second, and a one-time $5 signup credit with no card required. Validate the live price and terms in the provider account before relying on these figures. Verify upload requirements, output retention, commercial terms, and failure billing before integrating. Rendering only assembles supplied assets; scripting and narration are separate costs.

## Out of scope for this first render
AI script generation, paid TTS, YouTube publishing, subscription billing, production accounts, and a production credit ledger.

## Completion test
A real MP4 created from uploaded images can be played and downloaded. Record actual provider cost and quality. Do not declare success until a real render and a repeatable build are verified.
