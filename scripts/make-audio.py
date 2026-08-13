#!/usr/bin/env python3
"""Pre-render short Slovenian + English speech clips (Edge neural voices)."""

import asyncio
from pathlib import Path
import subprocess

import edge_tts

OUT = Path("/workspace/public/audio")
OUT.mkdir(parents=True, exist_ok=True)
TMP = Path("/tmp/mila-tts")
TMP.mkdir(parents=True, exist_ok=True)

SL_VOICE = "sl-SI-PetraNeural"
EN_VOICE = "en-GB-SoniaNeural"


async def speak(text: str, voice: str, dest: Path, rate: str = "-10%") -> None:
    comm = edge_tts.Communicate(text, voice, rate=rate)
    await comm.save(str(dest))


def concat(parts: list[Path], dest: Path) -> None:
    lst = TMP / f"{dest.stem}.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c:a",
            "libmp3lame",
            "-q:a",
            "5",
            "-ar",
            "22050",
            str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


silence = TMP / "silence.mp3"
subprocess.run(
    [
        "ffmpeg",
        "-y",
        "-f",
        "lavfi",
        "-i",
        "anullsrc=r=22050:cl=mono",
        "-t",
        "0.4",
        "-q:a",
        "9",
        str(silence),
    ],
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

sl = {
    "pozdravljena": "Pozdravljena. Jaz sem Mila. Skupaj se učiva angleško. Pritisni sliko.",
    "izberi": "Izberi sliko.",
    "poslusaj": "Poslušaj.",
    "pritisni": "Pritisni sliko, ki jo slišiš.",
    "tako-je": "Tako je.",
    "poskusi": "Poskusi še enkrat.",
    "konec": "Konec. Super.",
}

en = {
    "I": "I",
    "you": "you",
    "a": "a",
    "an": "an",
    "is": "is",
    "are": "are",
    "this": "this",
    "that": "that",
    "I-have": "I have",
    "I-am": "I am",
    "you-are": "you are",
    "an-apple": "an apple",
    "a-banana": "a banana",
    "an-egg": "an egg",
    "a-cat": "a cat",
    "the-cat-is": "the cat is",
    "the-cats-are": "the cats are",
    "this-ball": "this ball",
    "that-ball": "that ball",
    "I-have-a-dog": "I have a dog",
    "I-have-a-book": "I have a book",
    "I-have-a-ball": "I have a ball",
    "the-cup-is": "the cup is",
    "the-cups-are": "the cups are",
}

pairs = [
    ("Jaz.", "I", "pair-I"),
    ("Ti.", "you", "pair-you"),
    ("Ena.", "a", "pair-a"),
    ("Ena.", "an", "pair-an"),
    ("Ena.", "is", "pair-is"),
    ("Več.", "are", "pair-are"),
    ("Blizu.", "this", "pair-this"),
    ("Daleč.", "that", "pair-that"),
    ("Imam.", "I have", "pair-I-have"),
    ("Sem.", "I am", "pair-I-am"),
    ("Si.", "you are", "pair-you-are"),
]


async def main() -> None:
    print("Slovenian…")
    for name, text in sl.items():
        dest = OUT / f"sl-{name}.mp3"
        await speak(text, SL_VOICE, dest, rate="-5%")
        print(" ", dest.name)

    print("English…")
    for name, text in en.items():
        dest = OUT / f"en-{name}.mp3"
        await speak(text, EN_VOICE, dest, rate="-20%")
        print(" ", dest.name)

    print("Pairs…")
    for sl_text, en_text, out_name in pairs:
        sl_path = TMP / f"{out_name}-sl.mp3"
        en_path = TMP / f"{out_name}-en.mp3"
        await speak(sl_text, SL_VOICE, sl_path, rate="-5%")
        await speak(en_text, EN_VOICE, en_path, rate="-20%")
        concat([sl_path, silence, en_path], OUT / f"{out_name}.mp3")
        print(" ", out_name)


asyncio.run(main())
print("files:", len(list(OUT.glob("*.mp3"))))
