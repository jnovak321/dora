export type Picture = {
  id: string;
  src: string;
  alt: string;
};

export type TeachStep = {
  picture: Picture;
  word: string;
  pairAudio: string;
  enAudio: string;
};

export type QuizStep = {
  promptAudio: string;
  correctId: string;
  optionIds: [string, string];
};

export type Lesson = {
  id: string;
  cover: string;
  coverAlt: string;
  teach: TeachStep[];
  quiz: QuizStep[];
};

const P = {
  doraI: { id: "dora-i", src: "/images/dora-i.jpg", alt: "I" },
  doraYou: { id: "dora-you", src: "/images/dora-you.jpg", alt: "you" },
  apple: { id: "apple", src: "/images/apple.jpg", alt: "apple" },
  egg: { id: "egg", src: "/images/egg.jpg", alt: "egg" },
  cat: { id: "cat", src: "/images/cat.jpg", alt: "cat" },
  cats: { id: "cats", src: "/images/cats.jpg", alt: "cats" },
  horse: { id: "horse", src: "/images/horse.jpg", alt: "horse" },
  horses: { id: "horses", src: "/images/horses.jpg", alt: "horses" },
  catNear: { id: "cat-near", src: "/images/cat-near.jpg", alt: "this" },
  horseFar: { id: "horse-far", src: "/images/horse-far.jpg", alt: "that" },
  doraCat: { id: "dora-cat", src: "/images/dora-cat.jpg", alt: "cat" },
  doraHorse: { id: "dora-horse", src: "/images/dora-horse.jpg", alt: "horse" },
  doraHappy: { id: "dora-happy", src: "/images/dora-happy.jpg", alt: "happy" },
  tall: { id: "tall", src: "/images/tall.jpg", alt: "tall" },
} as const;

export const LESSONS: Lesson[] = [
  {
    id: "jaz-ti",
    cover: "/images/dora-i.jpg",
    coverAlt: "I you",
    teach: [
      {
        picture: P.doraI,
        word: "I",
        pairAudio: "/audio/pair-I.mp3",
        enAudio: "/audio/en-I.mp3",
      },
      {
        picture: P.doraYou,
        word: "you",
        pairAudio: "/audio/pair-you.mp3",
        enAudio: "/audio/en-you.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-I.mp3",
        correctId: "dora-i",
        optionIds: ["dora-i", "dora-you"],
      },
      {
        promptAudio: "/audio/en-you.mp3",
        correctId: "dora-you",
        optionIds: ["dora-i", "dora-you"],
      },
      {
        promptAudio: "/audio/en-I.mp3",
        correctId: "dora-i",
        optionIds: ["dora-you", "dora-i"],
      },
      {
        promptAudio: "/audio/en-you.mp3",
        correctId: "dora-you",
        optionIds: ["dora-you", "dora-i"],
      },
    ],
  },
  {
    id: "a-an",
    cover: "/images/horse.jpg",
    coverAlt: "a an",
    teach: [
      {
        picture: P.cat,
        word: "a",
        pairAudio: "/audio/pair-a.mp3",
        enAudio: "/audio/en-a-cat.mp3",
      },
      {
        picture: P.horse,
        word: "a",
        pairAudio: "/audio/pair-a.mp3",
        enAudio: "/audio/en-a-horse.mp3",
      },
      {
        picture: P.apple,
        word: "an",
        pairAudio: "/audio/pair-an.mp3",
        enAudio: "/audio/en-an-apple.mp3",
      },
      {
        picture: P.egg,
        word: "an",
        pairAudio: "/audio/pair-an.mp3",
        enAudio: "/audio/en-an-egg.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-a-cat.mp3",
        correctId: "cat",
        optionIds: ["cat", "apple"],
      },
      {
        promptAudio: "/audio/en-a-horse.mp3",
        correctId: "horse",
        optionIds: ["horse", "egg"],
      },
      {
        promptAudio: "/audio/en-an-apple.mp3",
        correctId: "apple",
        optionIds: ["cat", "apple"],
      },
      {
        promptAudio: "/audio/en-an-egg.mp3",
        correctId: "egg",
        optionIds: ["horse", "egg"],
      },
    ],
  },
  {
    id: "is-are",
    cover: "/images/cat.jpg",
    coverAlt: "is are",
    teach: [
      {
        picture: P.cat,
        word: "is",
        pairAudio: "/audio/pair-is.mp3",
        enAudio: "/audio/en-the-cat-is.mp3",
      },
      {
        picture: P.cats,
        word: "are",
        pairAudio: "/audio/pair-are.mp3",
        enAudio: "/audio/en-the-cats-are.mp3",
      },
      {
        picture: P.horse,
        word: "is",
        pairAudio: "/audio/pair-is.mp3",
        enAudio: "/audio/en-the-horse-is.mp3",
      },
      {
        picture: P.horses,
        word: "are",
        pairAudio: "/audio/pair-are.mp3",
        enAudio: "/audio/en-the-horses-are.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-the-cat-is.mp3",
        correctId: "cat",
        optionIds: ["cat", "cats"],
      },
      {
        promptAudio: "/audio/en-the-cats-are.mp3",
        correctId: "cats",
        optionIds: ["cat", "cats"],
      },
      {
        promptAudio: "/audio/en-the-horse-is.mp3",
        correctId: "horse",
        optionIds: ["horse", "horses"],
      },
      {
        promptAudio: "/audio/en-the-horses-are.mp3",
        correctId: "horses",
        optionIds: ["horses", "horse"],
      },
    ],
  },
  {
    id: "this-that",
    cover: "/images/cat-near.jpg",
    coverAlt: "this that",
    teach: [
      {
        picture: P.catNear,
        word: "this",
        pairAudio: "/audio/pair-this.mp3",
        enAudio: "/audio/en-this-cat.mp3",
      },
      {
        picture: P.horseFar,
        word: "that",
        pairAudio: "/audio/pair-that.mp3",
        enAudio: "/audio/en-that-horse.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-this.mp3",
        correctId: "cat-near",
        optionIds: ["cat-near", "horse-far"],
      },
      {
        promptAudio: "/audio/en-that.mp3",
        correctId: "horse-far",
        optionIds: ["cat-near", "horse-far"],
      },
      {
        promptAudio: "/audio/en-this-cat.mp3",
        correctId: "cat-near",
        optionIds: ["horse-far", "cat-near"],
      },
      {
        promptAudio: "/audio/en-that-horse.mp3",
        correctId: "horse-far",
        optionIds: ["horse-far", "cat-near"],
      },
    ],
  },
  {
    id: "imam",
    cover: "/images/dora-horse.jpg",
    coverAlt: "I have",
    teach: [
      {
        picture: P.doraCat,
        word: "I have",
        pairAudio: "/audio/pair-I-have.mp3",
        enAudio: "/audio/en-I-have-a-cat.mp3",
      },
      {
        picture: P.doraHorse,
        word: "I have",
        pairAudio: "/audio/pair-I-have.mp3",
        enAudio: "/audio/en-I-have-a-horse.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-I-have-a-cat.mp3",
        correctId: "dora-cat",
        optionIds: ["dora-cat", "dora-horse"],
      },
      {
        promptAudio: "/audio/en-I-have-a-horse.mp3",
        correctId: "dora-horse",
        optionIds: ["dora-cat", "dora-horse"],
      },
      {
        promptAudio: "/audio/en-I-have-a-cat.mp3",
        correctId: "dora-cat",
        optionIds: ["dora-horse", "dora-cat"],
      },
      {
        promptAudio: "/audio/en-I-have-a-horse.mp3",
        correctId: "dora-horse",
        optionIds: ["dora-horse", "dora-cat"],
      },
    ],
  },
  {
    id: "sem-si",
    cover: "/images/dora-happy.jpg",
    coverAlt: "I am you are",
    teach: [
      {
        picture: P.doraHappy,
        word: "I am",
        pairAudio: "/audio/pair-I-am.mp3",
        enAudio: "/audio/en-I-am.mp3",
      },
      {
        picture: P.tall,
        word: "you are",
        pairAudio: "/audio/pair-you-are.mp3",
        enAudio: "/audio/en-you-are.mp3",
      },
    ],
    quiz: [
      {
        promptAudio: "/audio/en-I-am.mp3",
        correctId: "dora-happy",
        optionIds: ["dora-happy", "tall"],
      },
      {
        promptAudio: "/audio/en-you-are.mp3",
        correctId: "tall",
        optionIds: ["dora-happy", "tall"],
      },
      {
        promptAudio: "/audio/en-I-am.mp3",
        correctId: "dora-happy",
        optionIds: ["tall", "dora-happy"],
      },
      {
        promptAudio: "/audio/en-you-are.mp3",
        correctId: "tall",
        optionIds: ["tall", "dora-happy"],
      },
    ],
  },
];

export const PICTURES: Record<string, Picture> = Object.fromEntries(
  Object.values(P).map((p) => [p.id, p]),
);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
