# Local narrated video proof

This optional assembly path uses Python 3, FFmpeg and ffprobe without provider calls or credits. It is a command-line tool, not a connected Studio feature. Existing Rendobar code is unchanged.

Place approved PNG/JPG scenes and approved narration beside a JSON manifest:

```json
{
  "assetsApproved": true,
  "narration": "approved-narration.mp3",
  "scenes": [
    {"image": "opening.png", "seconds": 5},
    {"image": "transformation.png", "seconds": 4},
    {"image": "product.png", "seconds": 7},
    {"image": "montage.png", "seconds": 9},
    {"image": "finish.png", "seconds": 5}
  ]
}
```

Run `python scripts/render-narrated-video.py /path/to/manifest.json /path/to/new-output.mp4`.

Output: 1280x720, 30 fps, H.264/AAC MP4 with faststart. Images are fitted with white padding. Include approved text/logo in the scene images; this tool does not generate visuals or voices. Short narration is padded with silence; narration longer than the timeline is rejected. Existing outputs and digitally silent narration are rejected. Approval is an operator declaration, not authentication or a rights verification system.

The tool verifies streams, duration and full decoding before copying the result. Human review must still confirm audible intelligible speech, visual quality, rights and accurate product claims. A test tone does not count as narration.

## Verified November 22, 2026

Synthetic images and a tone produced a 30-second MP4 and passed full decoding. Rejection checks covered overwrite, missing approval, digital silence and narration truncation. These are technical fixtures, not the accepted commercial. No provider calls or credit usage.

## Remaining milestone

Supply approved commercial scene images and the approved spoken recording. Assemble and watch/listen to the final 30-second file. No final commercial has been produced by this check. App integration and YouTube publishing remain separate work; publishing and provider spending require Craig's approval.
