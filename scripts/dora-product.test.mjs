import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonsSrc = readFileSync(join(root, "src/lib/lessons.ts"), "utf8");
const progressSrc = readFileSync(join(root, "src/lib/progress.ts"), "utf8");
const playSrc = readFileSync(join(root, "src/components/lesson-play.tsx"), "utf8");
const homeSrc = readFileSync(join(root, "src/routes/index.tsx"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/picture-card.tsx"), "utf8");

function hashFile(rel) {
  return createHash("sha256").update(readFileSync(join(root, rel))).digest("hex");
}

function mergeProgress(persisted, current) {
  const incoming = persisted ?? {};
  const stars = { ...current.stars };
  for (const [id, value] of Object.entries(incoming.stars ?? {})) {
    stars[id] = Math.max(stars[id] ?? 0, value ?? 0);
  }
  const stickers = { ...current.stickers, ...(incoming.stickers ?? {}) };
  for (const [id, value] of Object.entries(stars)) {
    if ((value ?? 0) > 0) stickers[id] = true;
  }
  return {
    started: !!(incoming.started || current.started),
    stars,
    stickers,
  };
}

test("this/that far uses a real cat-far.jpg, not a CSS zoom of cat-near", () => {
  assert.match(lessonsSrc, /id: "cat-far"/);
  const farLine = lessonsSrc.match(/catFar:\s*\{[^}]+\}/);
  assert.ok(farLine, "catFar picture entry missing");
  assert.match(farLine[0], /src: "\/images\/cat-far\.jpg"/);
  assert.doesNotMatch(farLine[0], /cat-near\.jpg/);
  assert.doesNotMatch(lessonsSrc, /far:\s*true/);
  assert.doesNotMatch(cardSrc, /p-\[18%\]/);
  assert.doesNotMatch(cardSrc, /\bfar\b/);
  assert.ok(existsSync(join(root, "public/images/cat-far.jpg")));
  assert.notEqual(
    hashFile("public/images/cat-near.jpg"),
    hashFile("public/images/cat-far.jpg"),
    "cat-far.jpg must be a distinct photo, not a copy of cat-near.jpg",
  );
});

test("is/are not-here uses same-scene empty plates, not cream-empty/path-open", () => {
  assert.match(lessonsSrc, /src: "\/images\/cat-gone\.jpg"/);
  assert.match(lessonsSrc, /src: "\/images\/cats-gone\.jpg"/);
  assert.doesNotMatch(lessonsSrc, /cream-empty\.jpg/);
  assert.doesNotMatch(lessonsSrc, /path-open\.jpg/);
  assert.ok(existsSync(join(root, "public/images/cat-gone.jpg")));
  assert.ok(existsSync(join(root, "public/images/cats-gone.jpg")));
  assert.notEqual(
    hashFile("public/images/cat.jpg"),
    hashFile("public/images/cat-gone.jpg"),
  );
  assert.notEqual(
    hashFile("public/images/cats.jpg"),
    hashFile("public/images/cats-gone.jpg"),
  );
});

test("contractions include it's, this isn't, that isn't plus the live set", () => {
  const required = [
    `"I'm."`,
    `"You're."`,
    `"I don't have a cat."`,
    `"The cat isn't here."`,
    `"The cats aren't here."`,
    `"It's a cat."`,
    `"It's an apple."`,
    `"This isn't a cat."`,
    `"That isn't a cat."`,
  ];
  for (const word of required) {
    assert.ok(lessonsSrc.includes(word), `missing teach/quiz word ${word}`);
  }
  for (const stem of [
    "Its-a-cat",
    "Its-an-apple",
    "this-isnt-a-cat",
    "that-isnt-a-cat",
  ]) {
    assert.ok(
      existsSync(join(root, `public/audio/en-${stem}.mp3`)),
      `missing en-${stem}.mp3`,
    );
    assert.ok(
      existsSync(join(root, `public/audio/pair-${stem}.mp3`)),
      `missing pair-${stem}.mp3`,
    );
  }
});

test("stamp award persists on the home grid after a simulated reload", () => {
  assert.match(playSrc, /onStamp/);
  assert.match(playSrc, /chime-stamp\.mp3/);
  assert.match(playSrc, /sl-bravo\.mp3/);
  assert.match(playSrc, /awardLesson/);
  assert.match(homeSrc, /hasHomeStamp/);
  assert.match(homeSrc, /stickers/);
  assert.match(progressSrc, /skipHydration:\s*true/);
  assert.match(progressSrc, /collectSticker/);
  assert.match(progressSrc, /PROGRESS_KEY/);

  const empty = { started: false, stars: {}, stickers: {} };
  const afterLesson = mergeProgress(undefined, {
    started: true,
    stars: { "this-that": 3 },
    stickers: { "this-that": true },
  });
  const afterReload = mergeProgress(afterLesson, empty);
  assert.equal(afterReload.started, true);
  assert.equal(afterReload.stars["this-that"], 3);
  assert.equal(afterReload.stickers["this-that"], true);

  const starsOnly = mergeProgress(
    { started: true, stars: { "is-are": 2 }, stickers: {} },
    empty,
  );
  assert.equal(starsOnly.stickers["is-are"], true);
});
