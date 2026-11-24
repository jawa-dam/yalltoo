#!/usr/bin/env python3
"""
Stream Clipper — finds the best moments in a stream and turns them into
finished vertical clips with bold two-word captions.

Usage:
    # Download + clip in one shot (needs yt-dlp + cookies):
    python clipper.py https://www.youtube.com/live/0ZZR9UIM34g --cookies cookies.txt

    # Or clip a local file you already downloaded:
    python clipper.py stream.mp4

    # Adjust how many clips and their length:
    python clipper.py stream.mp4 --max-clips 5 --clip-duration 30
"""

import argparse
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")

FUNNY_WORDS = {
    "bro", "bruh", "dude", "lmao", "lol", "wtf", "omg", "damn", "dead",
    "literally", "sus", "ratio", "cope", "slay", "bussin", "fire", "cap",
    "nah", "yeet", "trash", "clown", "toxic", "rage", "fail", "rip",
    "oof", "sheesh", "goat", "clutch", "choke", "throw", "whiff", "bot",
    "noob", "destroyed", "obliterated", "demolished", "annihilated",
    "insane", "crazy", "unreal", "impossible", "ridiculous", "absurd",
    "hilarious", "stupid", "dumb", "idiot", "genius", "legend", "god",
    "killed", "died", "murder", "massacre", "slaughter", "wrecked",
    "smashed", "crushed", "owned", "rekt", "bodied", "clapped",
    "screaming", "crying", "panicking", "freaking", "flipping",
    "absolutely", "actually", "honestly", "basically", "seriously",
    "wrong", "mistake", "oops", "accident", "disaster", "catastrophe",
    "explosion", "exploded", "boom", "kaboom", "smack", "slap", "punch",
    "naked", "naked", "butt", "fart", "poop", "twerk",
    "money", "million", "billion", "rich", "broke", "scam", "robbed",
    "again", "twice", "triple", "never", "always", "every", "worst",
    "best", "biggest", "smallest", "fastest", "slowest",
    "what", "why", "how", "who", "where", "huh", "wait", "no", "yes",
    "please", "stop", "help", "run", "hide", "watch", "look",
    "fell", "tripped", "slipped", "dropped", "forgot", "missed",
    "glitch", "bug", "hack", "cheat", "exploit", "broken",
    "headshot", "snipe", "noscope", "360", "combo", "streak",
    "teamkill", "friendly", "betrayed", "backstab",
}

EXCLAMATION_WORDS = {
    "oh", "ah", "wow", "whoa", "ooh", "aah", "ugh", "yikes", "geez",
    "holy", "god", "lord", "jesus", "christ", "hell", "heck",
}


def run(cmd, **kwargs):
    kwargs.setdefault("capture_output", True)
    kwargs.setdefault("text", True)
    result = subprocess.run(cmd, **kwargs)
    if result.returncode != 0 and kwargs.get("check", False):
        print(f"Command failed: {' '.join(cmd)}", file=sys.stderr)
        if result.stderr:
            print(result.stderr[:500], file=sys.stderr)
    return result


def download_stream(url, cookies_file, output_dir):
    print(f"Downloading stream: {url}")
    out_path = os.path.join(output_dir, "stream.%(ext)s")
    cmd = [
        "yt-dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
        "--merge-output-format", "mp4",
        "-o", out_path,
    ]
    if cookies_file:
        cmd += ["--cookies", cookies_file]
    cmd.append(url)
    result = run(cmd, check=False)
    if result.returncode != 0:
        print("yt-dlp failed. stderr:", file=sys.stderr)
        print(result.stderr[:1000] if result.stderr else "(none)", file=sys.stderr)
        sys.exit(1)
    matches = list(Path(output_dir).glob("stream.*"))
    if not matches:
        print("Download produced no file", file=sys.stderr)
        sys.exit(1)
    return str(matches[0])


def get_duration(video_path):
    r = run([
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", video_path,
    ])
    info = json.loads(r.stdout)
    return float(info["format"]["duration"])


def extract_audio_wav(video_path, output_path):
    print("Extracting audio...")
    run([
        "ffmpeg", "-y", "-i", video_path,
        "-ac", "1", "-ar", "16000", "-f", "wav", output_path,
    ], check=False)
    return output_path


def compute_energy_profile(wav_path, window_sec=1.0):
    with wave.open(wav_path, "r") as wf:
        rate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)

    samples = struct.unpack(f"<{n_frames}h", raw)
    window = int(rate * window_sec)
    energies = []
    for i in range(0, len(samples) - window, window):
        chunk = samples[i:i + window]
        rms = math.sqrt(sum(s * s for s in chunk) / len(chunk))
        energies.append(rms)
    return energies


def transcribe_audio(wav_path, model_size="base"):
    print(f"Transcribing with faster-whisper ({model_size})...")
    import numpy as np
    from faster_whisper import WhisperModel

    # Load WAV as numpy array to avoid av library compatibility issues
    with wave.open(wav_path, "r") as wf:
        rate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(samples, beam_size=5, word_timestamps=True)
    words = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                words.append({
                    "word": w.word.strip(),
                    "start": w.start,
                    "end": w.end,
                })
    print(f"  Transcribed {len(words)} words, language={info.language}")
    return words, info.language


def score_window(words, start_t, end_t, energy_scores, funny_words):
    score = 0.0

    window_words = [w for w in words if w["start"] >= start_t and w["end"] <= end_t]

    funny_count = sum(
        1 for w in window_words if w["word"].lower().strip(".,!?'\"") in funny_words
    )
    score += funny_count * 15

    excl_count = sum(
        1 for w in window_words if w["word"].lower().strip(".,!?'\"") in EXCLAMATION_WORDS
    )
    score += excl_count * 10

    if window_words:
        duration = end_t - start_t
        words_per_sec = len(window_words) / max(duration, 1)
        if words_per_sec > 3.0:
            score += (words_per_sec - 3.0) * 20

    e_start = max(0, int(start_t))
    e_end = min(len(energy_scores), int(end_t))
    if e_start < e_end:
        window_energy = energy_scores[e_start:e_end]
        avg_all = sum(energy_scores) / max(len(energy_scores), 1)
        avg_window = sum(window_energy) / max(len(window_energy), 1)
        if avg_all > 0:
            energy_ratio = avg_window / avg_all
            if energy_ratio > 1.5:
                score += (energy_ratio - 1.0) * 25

        max_e = max(window_energy) if window_energy else 0
        if avg_all > 0 and max_e / avg_all > 3.0:
            score += 20

    text = " ".join(w["word"] for w in window_words).lower()
    if any(p in text for p in ["?!", "!!", "oh my", "what the", "no way", "let's go"]):
        score += 15
    if any(p in text for p in ["haha", "lol", "lmao", "😂", "dead"]):
        score += 10

    return score


def find_peak_in_window(energies, start_t, end_t):
    """Find the loudest second in a window — that's where the moment is."""
    e_start = max(0, int(start_t))
    e_end = min(len(energies), int(end_t))
    if e_start >= e_end:
        return start_t
    window = energies[e_start:e_end]
    peak_idx = window.index(max(window))
    return e_start + peak_idx


def find_highlights(words, energies, duration, clip_duration=30, max_clips=5, min_gap=60):
    print("Scoring windows for highlights...")
    all_funny = FUNNY_WORDS | EXCLAMATION_WORDS
    scores = []
    step = 5
    for t in range(0, int(duration) - clip_duration, step):
        s = score_window(words, t, t + clip_duration, energies, all_funny)
        scores.append((t, s))

    scores.sort(key=lambda x: x[1], reverse=True)

    selected = []
    for t, s in scores:
        if s <= 0:
            break
        overlap = False
        for st, _ in selected:
            if abs(t - st) < min_gap:
                overlap = True
                break
        if not overlap:
            # Find the peak moment and start the clip 2s before it
            # so the first second shows the action, not dead air
            peak = find_peak_in_window(energies, t, t + clip_duration)
            start = max(0, peak - 2)
            end = start + clip_duration
            if end > duration:
                start = max(0, duration - clip_duration)
            selected.append((int(start), s))
        if len(selected) >= max_clips:
            break

    selected.sort(key=lambda x: x[0])
    print(f"  Found {len(selected)} highlight windows")
    for i, (t, s) in enumerate(selected):
        m, sec = divmod(int(t), 60)
        print(f"    #{i+1}: {m}:{sec:02d} (score={s:.1f})")
    return selected


def pick_funny_word(word_pair):
    w1, w2 = word_pair
    t1 = w1["word"].lower().strip(".,!?'\"")
    t2 = w2["word"].lower().strip(".,!?'\"")
    if t1 in FUNNY_WORDS and t2 not in FUNNY_WORDS:
        return 0
    if t2 in FUNNY_WORDS and t1 not in FUNNY_WORDS:
        return 1
    if t1 in EXCLAMATION_WORDS:
        return 0
    if t2 in EXCLAMATION_WORDS:
        return 1
    if len(t1) > len(t2) + 2:
        return 0
    if len(t2) > len(t1) + 2:
        return 1
    return 1


def generate_title(words, start_t, end_t):
    window_words = [w for w in words if w["start"] >= start_t and w["end"] <= end_t]
    if not window_words:
        return "Wild Moment"

    text = " ".join(w["word"] for w in window_words).lower()

    action_patterns = [
        (r"(killed|died|dead|death)", "Didn't Survive This"),
        (r"(fell|fall|falling)", "The Fall Was Brutal"),
        (r"(explod|blow|boom)", "Everything Exploded"),
        (r"(scream|yell|shout)", "The Scream Says It All"),
        (r"(miss|missed|whiff)", "Missed Every Shot"),
        (r"(clutch|save|saved)", "Clutch Save Out of Nowhere"),
        (r"(rage|angry|mad)", "Pure Rage Moment"),
        (r"(fail|failed)", "This Went So Wrong"),
        (r"(win|won|victory)", "Against All Odds"),
        (r"(no way|impossible|unreal|insane)", "Nobody Expected This"),
        (r"(what the|wtf|omg)", "Wait What Just Happened"),
        (r"(run|running|chase)", "The Chase Got Intense"),
        (r"(jump|jumped|leap)", "The Jump Was Crazy"),
        (r"(trick|tricked|bait)", "Completely Baited"),
        (r"(team|squad|crew)", "The Squad Lost It"),
        (r"(money|rich|broke)", "The Price Was Insane"),
        (r"(first|never|ever)", "First Time Seeing This"),
    ]
    for pattern, title in action_patterns:
        if re.search(pattern, text):
            return title

    funny_in_window = [
        w for w in window_words
        if w["word"].lower().strip(".,!?'\"") in FUNNY_WORDS
    ]
    if funny_in_window:
        word = funny_in_window[0]["word"].strip(".,!?'\"").capitalize()
        return f"The {word} Moment Was Real"

    loud_words = sorted(window_words, key=lambda w: len(w["word"]), reverse=True)
    if loud_words:
        big_word = loud_words[0]["word"].strip(".,!?'\"").capitalize()
        return f"When {big_word} Happened"

    return "This Moment Was Unreal"


def build_caption_filter(words, start_t, clip_duration, video_w, video_h):
    clip_words = [
        w for w in words
        if w["start"] >= start_t and w["end"] <= start_t + clip_duration
    ]
    if not clip_words:
        return ""

    # Pair words two at a time
    pairs = []
    for i in range(0, len(clip_words) - 1, 2):
        pairs.append((clip_words[i], clip_words[i + 1]))
    if len(clip_words) % 2 == 1:
        pairs.append((clip_words[-1], None))

    font = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    if not os.path.exists(font):
        fonts = subprocess.run(
            ["fc-list", ":style=Bold", "--format=%{file}\n"],
            capture_output=True, text=True,
        )
        lines = [l for l in fonts.stdout.strip().split("\n") if l]
        font = lines[0] if lines else "Sans"

    font_size = int(video_w * 0.08)
    outline = max(4, int(font_size * 0.12))
    y_pos = int(video_h * 0.75)

    drawtext_parts = []
    for pair in pairs:
        w1 = pair[0]
        w2 = pair[1]

        t_start = w1["start"] - start_t
        t_end = (w2["end"] if w2 else w1["end"]) - start_t

        if w2:
            text1 = w1["word"].upper()
            text2 = w2["word"].upper()
            funny_idx = pick_funny_word(pair)
            drawtext_parts.append(build_two_word_caption(
                text1, text2, funny_idx, font, font_size, outline,
                y_pos, t_start, t_end, video_w,
            ))
        else:
            text1 = w1["word"].upper()
            is_funny = w1["word"].lower().strip(".,!?'\"") in FUNNY_WORDS
            color = "yellow" if is_funny else "white"
            dt = (
                f"drawtext=text='{esc(text1)}':"
                f"fontfile='{font}':"
                f"fontsize={font_size}:"
                f"fontcolor={color}:"
                f"borderw={outline}:"
                f"bordercolor=black:"
                f"x=(w-text_w)/2:"
                f"y={y_pos}:"
                f"enable='between(t,{t_start:.3f},{t_end:.3f})'"
            )
            drawtext_parts.append(dt)

    return ",".join(drawtext_parts)


def build_two_word_caption(text1, text2, funny_idx, font, font_size, outline,
                            y_pos, t_start, t_end, video_w):
    space_w = font_size // 2
    color1 = "yellow" if funny_idx == 0 else "white"
    color2 = "yellow" if funny_idx == 1 else "white"

    avg_char_w = font_size * 0.72
    w1_px = int(len(text1) * avg_char_w) + outline * 2
    w2_px = int(len(text2) * avg_char_w) + outline * 2
    total_px = w1_px + space_w + w2_px

    x1 = f"(w-{total_px})/2"
    x2 = f"(w-{total_px})/2+{w1_px + space_w}"

    dt1 = (
        f"drawtext=text='{esc(text1)}':"
        f"fontfile='{font}':"
        f"fontsize={font_size}:"
        f"fontcolor={color1}:"
        f"borderw={outline}:"
        f"bordercolor=black:"
        f"x={x1}:"
        f"y={y_pos}:"
        f"enable='between(t,{t_start:.3f},{t_end:.3f})'"
    )
    dt2 = (
        f"drawtext=text='{esc(text2)}':"
        f"fontfile='{font}':"
        f"fontsize={font_size}:"
        f"fontcolor={color2}:"
        f"borderw={outline}:"
        f"bordercolor=black:"
        f"x={x2}:"
        f"y={y_pos}:"
        f"enable='between(t,{t_start:.3f},{t_end:.3f})'"
    )
    return f"{dt1},{dt2}"


def esc(text):
    return (
        text.replace("\\", "\\\\")
        .replace("'", "'\\''")
        .replace(":", "\\:")
        .replace("%", "\\%")
    )


def get_video_dimensions(video_path):
    r = run([
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_streams", video_path,
    ])
    streams = json.loads(r.stdout)
    for s in streams.get("streams", []):
        if s.get("codec_type") == "video":
            return int(s["width"]), int(s["height"])
    return 1920, 1080


def cut_clip(video_path, start_t, clip_duration, output_path, words, title):
    print(f"  Cutting clip at {int(start_t)}s → {output_path}")

    src_w, src_h = get_video_dimensions(video_path)

    # Target 9:16 vertical
    out_w = 1080
    out_h = 1920

    # Crop source to 9:16 from center
    src_ratio = src_w / src_h
    target_ratio = 9 / 16

    if src_ratio > target_ratio:
        crop_h = src_h
        crop_w = int(src_h * target_ratio)
    else:
        crop_w = src_w
        crop_h = int(src_w / target_ratio)

    crop_x = (src_w - crop_w) // 2
    crop_y = (src_h - crop_h) // 2

    crop_filter = f"crop={crop_w}:{crop_h}:{crop_x}:{crop_y}"
    scale_filter = f"scale={out_w}:{out_h}"

    caption_filter = build_caption_filter(words, start_t, clip_duration, out_w, out_h)

    vf = f"{crop_filter},{scale_filter}"
    if caption_filter:
        vf += f",{caption_filter}"

    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start_t),
        "-i", video_path,
        "-t", str(clip_duration),
        "-vf", vf,
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        output_path,
    ]
    result = run(cmd, check=False)
    if result.returncode != 0:
        print(f"    ffmpeg failed: {result.stderr[:300] if result.stderr else '(no stderr)'}")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Stream Clipper — find highlights and make vertical clips with captions"
    )
    parser.add_argument(
        "source",
        help="YouTube URL or path to a local video file",
    )
    parser.add_argument(
        "--cookies", "-c",
        help="Path to cookies.txt file for YouTube download",
    )
    parser.add_argument(
        "--output", "-o",
        default="clips",
        help="Output directory for clips (default: clips/)",
    )
    parser.add_argument(
        "--max-clips", "-n",
        type=int, default=5,
        help="Maximum number of clips to generate (default: 5)",
    )
    parser.add_argument(
        "--clip-duration", "-d",
        type=int, default=30,
        help="Duration of each clip in seconds (default: 30)",
    )
    parser.add_argument(
        "--min-gap", "-g",
        type=int, default=60,
        help="Minimum gap between clips in seconds (default: 60)",
    )
    parser.add_argument(
        "--whisper-model", "-m",
        default="base",
        help="Whisper model size: tiny, base, small, medium, large-v3 (default: base)",
    )
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    work_dir = tempfile.mkdtemp(prefix="clipper_")

    try:
        # Step 1: Get the video
        source = args.source
        if source.startswith("http://") or source.startswith("https://"):
            video_path = download_stream(source, args.cookies, work_dir)
        else:
            video_path = os.path.abspath(source)
            if not os.path.exists(video_path):
                print(f"File not found: {video_path}", file=sys.stderr)
                sys.exit(1)

        duration = get_duration(video_path)
        print(f"Video duration: {duration/60:.1f} minutes")

        # Step 2: Extract audio
        wav_path = os.path.join(work_dir, "audio.wav")
        extract_audio_wav(video_path, wav_path)

        # Step 3: Compute energy profile
        print("Analyzing audio energy...")
        energies = compute_energy_profile(wav_path)

        # Step 4: Transcribe
        words, lang = transcribe_audio(wav_path, args.whisper_model)

        # Step 5: Find highlights
        highlights = find_highlights(
            words, energies, duration,
            clip_duration=args.clip_duration,
            max_clips=args.max_clips,
            min_gap=args.min_gap,
        )

        if not highlights:
            print("No highlights found — the stream may be too quiet or short.")
            sys.exit(0)

        # Step 6: Cut clips with captions
        print(f"\nGenerating {len(highlights)} clips...")
        for i, (start_t, score) in enumerate(highlights):
            title = generate_title(words, start_t, start_t + args.clip_duration)
            safe_title = re.sub(r"[^a-zA-Z0-9 ]", "", title)[:40].strip().replace(" ", "_")
            filename = f"clip_{i+1:02d}_{safe_title}.mp4"
            out_path = os.path.join(args.output, filename)

            ok = cut_clip(
                video_path, start_t, args.clip_duration, out_path, words, title,
            )
            if ok:
                print(f"    ✓ {filename}  —  \"{title}\"")

        print(f"\nDone! {len(highlights)} clips saved to {args.output}/")

    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
