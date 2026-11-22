#!/usr/bin/env python3
"""Local, no-provider-cost MP4 assembly from approved images and narration."""
import argparse
import json
import math
from pathlib import Path
import subprocess
import tempfile


def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]).stdout)


def assemble(manifest_path, output):
    manifest_path = Path(manifest_path).resolve()
    output = Path(output).resolve()
    if output.exists():
        raise ValueError('Output already exists; choose a new filename to preserve previous renders.')
    data = json.loads(manifest_path.read_text())
    if not isinstance(data, dict):
        raise ValueError('Manifest must be a JSON object.')
    if data.get('assetsApproved') is not True:
        raise ValueError('assetsApproved must be true for these images and this narration.')
    scenes = data.get('scenes', [])
    if not isinstance(scenes, list) or not 1 <= len(scenes) <= 30:
        raise ValueError('Supply 1 to 30 image scenes.')
    def asset(name):
        if not isinstance(name, str) or not name:
            raise ValueError('Asset paths must be nonempty strings.')
        p = (manifest_path.parent / name).resolve()
        if not p.is_file():
            raise ValueError(f'Missing local asset: {p.name}')
        return p
    images, durations = [], []
    for scene in scenes:
        if not isinstance(scene, dict):
            raise ValueError('Each scene must be an object.')
        image = asset(scene['image'])
        if image.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
            raise ValueError('Scenes must be JPG or PNG images.')
        duration = scene['seconds']
        if isinstance(duration, bool) or not isinstance(duration, (int, float)) or not math.isfinite(duration) or not 0.1 <= duration <= 300:
            raise ValueError('Each scene requires a finite duration between 0.1 and 300 seconds.')
        if not any(s['codec_type'] == 'video' for s in probe(image)['streams']):
            raise ValueError('Scene is not a readable image.')
        images.append(image)
        durations.append(duration)
    total = sum(durations)
    narration = asset(data['narration'])
    info = probe(narration)
    if not any(s['codec_type'] == 'audio' for s in info['streams']):
        raise ValueError('Narration must contain an audio stream.')
    audio_seconds = float(info['format']['duration'])
    if audio_seconds > total + 0.1:
        raise ValueError(f'Narration is {audio_seconds:.2f}s but timeline is {total:.2f}s; refusing to cut off speech.')
    silence = run(['ffmpeg', '-hide_banner', '-i', str(narration), '-af', 'astats=metadata=0:reset=0', '-f', 'null', '-']).stderr
    if 'Peak level dB: -inf' in silence:
        raise ValueError('Narration is digital silence.')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='tg-render-') as tmp:
        clips = []
        for i, (image, duration) in enumerate(zip(images, durations)):
            clip = Path(tmp) / f'{i:03}.mp4'
            run(['ffmpeg', '-v', 'error', '-nostdin', '-loop', '1', '-i', str(image), '-t', str(duration), '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1', '-r', '30', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-an', str(clip)])
            clips.append(clip)
        listing = Path(tmp) / 'clips.txt'
        listing.write_text(''.join(f"file '{p}'\n" for p in clips))
        staged = Path(tmp) / 'finished.mp4'
        run(['ffmpeg', '-v', 'error', '-nostdin', '-f', 'concat', '-safe', '0', '-i', str(listing), '-i', str(narration), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-t', str(total), '-movflags', '+faststart', str(staged)])
        result = probe(staged)
        types = {s['codec_type'] for s in result['streams']}
        if not {'video', 'audio'} <= types or abs(float(result['format']['duration']) - total) > 0.15:
            raise ValueError('Rendered output failed stream/duration verification.')
        run(['ffmpeg', '-v', 'error', '-nostdin', '-i', str(staged), '-f', 'null', '-'])
        # Exclusive creation: never overwrite an existing delivery.
        with output.open('xb') as target, staged.open('rb') as source:
            import shutil
            shutil.copyfileobj(source, target)
    print(json.dumps({'output': str(output), 'seconds': total, 'video': True, 'audio': True, 'decodeCheck': 'passed', 'providerCalls': 0}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest')
    parser.add_argument('output')
    args = parser.parse_args()
    try:
        assemble(args.manifest, args.output)
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f'Render failed: {error}\n')
