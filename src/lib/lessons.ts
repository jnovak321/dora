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
  promptWord: string;
  promptAudio: string;
  correctId: string;
  optionIds: [string, string];
};

export type LessonTint = "clay" | "sage" | "honey";

export type Lesson = {
  id: string;
  cover: string;
  title: string;
  tint: LessonTint;
  teach: TeachStep[];
  quiz: QuizStep[];
};

const P = {
  doraI: { id: "dora-i", src: "/images/dora-i.jpg", alt: "I" },
  doraYou: { id: "dora-you", src: "/images/dora-you.jpg", alt: "you" },
  apple: { id: "apple", src: "/images/apple.jpg", alt: "apple" },
  cat: { id: "cat", src: "/images/cat.jpg", alt: "cat" },
  horse: { id: "horse", src: "/images/horse.jpg", alt: "horse" },
  catNear: { id: "cat-near", src: "/images/cat-near.jpg", alt: "this cat" },
  catFar: { id: "cat-far", src: "/images/cat-far.jpg", alt: "that cat" },
  catNearGone: {
    id: "cat-near-gone",
    src: "/images/beam-empty.jpg",
    alt: "not a cat",
  },
  catFarGone: {
    id: "cat-far-gone",
    src: "/images/cat-far-gone.jpg",
    alt: "not a cat",
  },
  catGone: { id: "cat-gone", src: "/images/cat-gone.jpg", alt: "not here" },
  cats: { id: "cats", src: "/images/cats.jpg", alt: "cats" },
  catsGone: { id: "cats-gone", src: "/images/cats-gone.jpg", alt: "not here" },
  doraCat: { id: "dora-cat", src: "/images/dora-cat.jpg", alt: "I have a cat" },
  doraHorse: {
    id: "dora-horse",
    src: "/images/dora-horse.jpg",
    alt: "I have a horse",
  },
  doraNone: { id: "dora-none", src: "/images/dora.jpg", alt: "I do not have" },
  doraHappy: { id: "dora-happy", src: "/images/dora-happy.jpg", alt: "happy" },
  doraIHappy: {
    id: "dora-i-happy",
    src: "/images/dora-i-smile.jpg",
    alt: "I am happy",
  },
  doraISad: {
    id: "dora-i-sad",
    src: "/images/dora-i-frown.jpg",
    alt: "I am sad",
  },
  doraYouHappy: {
    id: "dora-you-happy",
    src: "/images/dora-you-smile.jpg",
    alt: "You are happy",
  },
  doraYouSad: {
    id: "dora-you-sad",
    src: "/images/dora-you-frown.jpg",
    alt: "You are sad",
  },
} as const;

function clip(stem: string) {
  return {
    pairAudio: `/audio/pair-${stem}.mp3`,
    enAudio: `/audio/en-${stem}.mp3`,
  };
}

function teach(picture: Picture, word: string, stem: string): TeachStep {
  return { picture, word, ...clip(stem) };
}

function quiz(
  promptWord: string,
  stem: string,
  correctId: string,
  optionIds: [string, string],
): QuizStep {
  return {
    promptWord,
    promptAudio: `/audio/en-${stem}.mp3`,
    correctId,
    optionIds,
  };
}

export const LESSONS: Lesson[] = [
  {
    id: "jaz-ti",
    cover: "/images/dora-i.jpg",
    title: "I you",
    tint: "clay",
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
      teach(P.doraI, "I am.", "I-am"),
      teach(P.doraI, "I'm.", "Im"),
      teach(P.doraYou, "You are.", "you-are"),
      teach(P.doraYou, "You're.", "youre"),
      teach(P.doraI, "I am not.", "I-am-not"),
      teach(P.doraI, "I'm not.", "Im-not"),
      teach(P.doraYou, "You are not.", "you-are-not"),
      teach(P.doraYou, "You're not.", "youre-not"),
      teach(P.doraI, "Am I?", "am-I"),
      teach(P.doraYou, "Are you?", "are-you"),
    ],
    quiz: [
      quiz("I", "I", "dora-i", ["dora-i", "dora-you"]),
      quiz("you", "you", "dora-you", ["dora-i", "dora-you"]),
      quiz("I'm.", "Im", "dora-i", ["dora-you", "dora-i"]),
      quiz("You are.", "you-are", "dora-you", ["dora-you", "dora-i"]),
      quiz("I'm not.", "Im-not", "dora-i", ["dora-i", "dora-you"]),
      quiz("Are you?", "are-you", "dora-you", ["dora-i", "dora-you"]),
    ],
  },
  {
    id: "a-an",
    cover: "/images/apple.jpg",
    title: "a an",
    tint: "sage",
    teach: [
      {
        picture: P.cat,
        word: "a cat",
        pairAudio: "/audio/pair-a.mp3",
        enAudio: "/audio/en-a-cat.mp3",
      },
      {
        picture: P.apple,
        word: "an apple",
        pairAudio: "/audio/pair-an.mp3",
        enAudio: "/audio/en-an-apple.mp3",
      },
      teach(P.cat, "It is a cat.", "it-is-a-cat"),
      teach(P.cat, "It's a cat.", "Its-a-cat"),
      teach(P.apple, "It is not a cat.", "it-is-not-a-cat"),
      teach(P.cat, "Is it a cat?", "is-it-a-cat"),
      teach(P.apple, "It is an apple.", "it-is-an-apple"),
      teach(P.apple, "It's an apple.", "Its-an-apple"),
      teach(P.cat, "It is not an apple.", "it-is-not-an-apple"),
      teach(P.apple, "Is it an apple?", "is-it-an-apple"),
    ],
    quiz: [
      quiz("a cat", "a-cat", "cat", ["cat", "apple"]),
      quiz("an apple", "an-apple", "apple", ["apple", "cat"]),
      quiz("It is a cat.", "it-is-a-cat", "cat", ["cat", "apple"]),
      quiz("It's a cat.", "Its-a-cat", "cat", ["apple", "cat"]),
      quiz("It is not a cat.", "it-is-not-a-cat", "apple", ["cat", "apple"]),
      quiz("Is it an apple?", "is-it-an-apple", "apple", ["cat", "apple"]),
    ],
  },
  {
    id: "is-are",
    cover: "/images/cats.jpg",
    title: "is are",
    tint: "honey",
    teach: [
      teach(P.cat, "The cat is here.", "the-cat-is-here"),
      teach(P.catGone, "The cat is not here.", "the-cat-is-not-here"),
      teach(P.catGone, "The cat isn't here.", "the-cat-isnt-here"),
      teach(P.cat, "Is the cat here?", "is-the-cat-here"),
      teach(P.cats, "The cats are here.", "the-cats-are-here"),
      teach(P.catsGone, "The cats are not here.", "the-cats-are-not-here"),
      teach(P.catsGone, "The cats aren't here.", "the-cats-arent-here"),
      teach(P.cats, "Are the cats here?", "are-the-cats-here"),
    ],
    quiz: [
      quiz("The cat is here.", "the-cat-is-here", "cat", ["cat", "cat-gone"]),
      quiz("The cat isn't here.", "the-cat-isnt-here", "cat-gone", [
        "cat",
        "cat-gone",
      ]),
      quiz("Is the cat here?", "is-the-cat-here", "cat", ["cat-gone", "cat"]),
      quiz("The cats are here.", "the-cats-are-here", "cats", [
        "cats",
        "cats-gone",
      ]),
      quiz("The cats aren't here.", "the-cats-arent-here", "cats-gone", [
        "cats-gone",
        "cats",
      ]),
      quiz("Are the cats here?", "are-the-cats-here", "cats", [
        "cats-gone",
        "cats",
      ]),
    ],
  },
  {
    id: "this-that",
    cover: "/images/cat-near.jpg",
    title: "this that",
    tint: "sage",
    teach: [
      teach(P.catNear, "This is a cat.", "this-is-a-cat"),
      teach(P.catFar, "That is a cat.", "that-is-a-cat"),
      teach(P.catNearGone, "This is not a cat.", "this-is-not-a-cat"),
      teach(P.catNearGone, "This isn't a cat.", "this-isnt-a-cat"),
      teach(P.catFarGone, "That is not a cat.", "that-is-not-a-cat"),
      teach(P.catFarGone, "That isn't a cat.", "that-isnt-a-cat"),
      teach(P.catNear, "Is this a cat?", "is-this-a-cat"),
      teach(P.catFar, "Is that a cat?", "is-that-a-cat"),
    ],
    quiz: [
      quiz("This is a cat.", "this-is-a-cat", "cat-near", [
        "cat-near",
        "cat-near-gone",
      ]),
      quiz("That is a cat.", "that-is-a-cat", "cat-far", [
        "cat-far",
        "cat-far-gone",
      ]),
      quiz("This isn't a cat.", "this-isnt-a-cat", "cat-near-gone", [
        "cat-near-gone",
        "cat-near",
      ]),
      quiz("That isn't a cat.", "that-isnt-a-cat", "cat-far-gone", [
        "cat-far",
        "cat-far-gone",
      ]),
      quiz("Is this a cat?", "is-this-a-cat", "cat-near", [
        "cat-near-gone",
        "cat-near",
      ]),
      quiz("Is that a cat?", "is-that-a-cat", "cat-far", [
        "cat-far-gone",
        "cat-far",
      ]),
    ],
  },
  {
    id: "imam",
    cover: "/images/dora-cat.jpg",
    title: "I have",
    tint: "clay",
    teach: [
      teach(P.doraCat, "I have a cat.", "I-have-a-cat"),
      teach(P.doraHorse, "I have a horse.", "I-have-a-horse"),
      teach(P.doraNone, "I do not have a cat.", "I-do-not-have-a-cat"),
      teach(P.doraNone, "I don't have a cat.", "I-dont-have-a-cat"),
      teach(P.doraNone, "I do not have a horse.", "I-do-not-have-a-horse"),
      teach(P.doraNone, "I don't have a horse.", "I-dont-have-a-horse"),
      teach(P.doraCat, "Do I have a cat?", "do-I-have-a-cat"),
      teach(P.doraHorse, "Do I have a horse?", "do-I-have-a-horse"),
    ],
    quiz: [
      quiz("I have a cat.", "I-have-a-cat", "dora-cat", [
        "dora-cat",
        "dora-none",
      ]),
      quiz("I have a horse.", "I-have-a-horse", "dora-horse", [
        "dora-none",
        "dora-horse",
      ]),
      quiz("I don't have a cat.", "I-dont-have-a-cat", "dora-none", [
        "dora-cat",
        "dora-none",
      ]),
      quiz("I do not have a horse.", "I-do-not-have-a-horse", "dora-none", [
        "dora-horse",
        "dora-none",
      ]),
      quiz("Do I have a cat?", "do-I-have-a-cat", "dora-cat", [
        "dora-none",
        "dora-cat",
      ]),
      quiz("Do I have a horse?", "do-I-have-a-horse", "dora-horse", [
        "dora-horse",
        "dora-none",
      ]),
    ],
  },
  {
    id: "sem-si",
    cover: "/images/dora-happy.jpg",
    title: "I am you are",
    tint: "honey",
    teach: [
      teach(P.doraIHappy, "I am happy.", "I-am-happy"),
      teach(P.doraIHappy, "I'm happy.", "Im-happy"),
      teach(P.doraYouHappy, "You are happy.", "you-are-happy"),
      teach(P.doraYouHappy, "You're happy.", "youre-happy"),
      teach(P.doraIHappy, "I am not sad.", "I-am-not-sad"),
      teach(P.doraIHappy, "I'm not sad.", "Im-not-sad"),
      teach(P.doraYouHappy, "You are not sad.", "you-are-not-sad"),
      teach(P.doraYouHappy, "You're not sad.", "youre-not-sad"),
      teach(P.doraIHappy, "Am I happy?", "am-I-happy"),
      teach(P.doraYouHappy, "Are you happy?", "are-you-happy"),
    ],
    quiz: [
      quiz("I'm happy.", "Im-happy", "dora-i-happy", [
        "dora-i-happy",
        "dora-i-sad",
      ]),
      quiz("You are happy.", "you-are-happy", "dora-you-happy", [
        "dora-you-happy",
        "dora-you-sad",
      ]),
      quiz("I am not sad.", "I-am-not-sad", "dora-i-happy", [
        "dora-i-sad",
        "dora-i-happy",
      ]),
      quiz("You're not sad.", "youre-not-sad", "dora-you-happy", [
        "dora-you-sad",
        "dora-you-happy",
      ]),
      quiz("Am I happy?", "am-I-happy", "dora-i-happy", [
        "dora-i-happy",
        "dora-i-sad",
      ]),
      quiz("Are you happy?", "are-you-happy", "dora-you-happy", [
        "dora-you-sad",
        "dora-you-happy",
      ]),
    ],
  },
];

export const PICTURES: Record<string, Picture> = Object.fromEntries(
  Object.values(P).map((p) => [p.id, p]),
);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export const REQUIRED_CONTRACTIONS = [
  "I'm.",
  "You're.",
  "don't",
  "isn't",
  "aren't",
  "It's a cat.",
  "This isn't a cat.",
  "That isn't a cat.",
] as const;
