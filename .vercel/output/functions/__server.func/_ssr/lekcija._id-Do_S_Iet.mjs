import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as House, s as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as Route$1 } from "./router-Bk0dHsDj.mjs";
import { a as playQueue, i as playClip, r as cn, s as stopSpeech, t as HomeLink } from "./icon-nav-BZUCGdea.mjs";
import { a as getLesson, i as Stars, n as PICTURES, o as starsFromMistakes, r as SpeakButton, s as useProgress } from "./progress-A4auGcFE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lekcija._id-Do_S_Iet.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PictureCard({ src, alt, selected = false, state = "idle", onClick, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(onClick ? "button" : "div", {
		type: onClick ? "button" : void 0,
		onClick,
		"aria-label": alt,
		className: cn("block overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]", "transition-[transform,box-shadow] duration-150 ease-out", onClick && "hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]", state === "ok" && "ring-4 ring-ok", state === "miss" && "ring-4 ring-miss animate-[shake_0.35s_ease-out]", selected && state === "idle" && "ring-4 ring-sage", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			draggable: false,
			className: "aspect-square w-full rounded-[calc(var(--radius-lg)-6px)] object-cover"
		})
	});
}
function LessonPlay({ id }) {
	const lesson = getLesson(id);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { lesson });
}
function Missing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {})
	});
}
function Player({ lesson }) {
	const navigate = useNavigate();
	const setStars = useProgress((s) => s.setStars);
	const [phase, setPhase] = (0, import_react.useState)({
		kind: "teach",
		index: 0
	});
	const [choice, setChoice] = (0, import_react.useState)(null);
	const [choiceState, setChoiceState] = (0, import_react.useState)("idle");
	const mistakes = (0, import_react.useRef)(0);
	const locked = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		return () => stopSpeech();
	}, []);
	(0, import_react.useEffect)(() => {
		locked.current = false;
		setChoice(null);
		setChoiceState("idle");
		if (phase.kind === "teach") {
			const step = lesson.teach[phase.index];
			playQueue([
				"/audio/sl-poslusaj.mp3",
				step.pairAudio,
				step.enAudio
			]);
			return;
		}
		if (phase.kind === "quiz") {
			const step = lesson.quiz[phase.index];
			const intro = phase.index === 0 ? ["/audio/sl-pritisni.mp3", step.promptAudio] : [step.promptAudio];
			playQueue(intro);
			return;
		}
		playQueue(["/audio/chime-ok.mp3", "/audio/sl-konec.mp3"]);
	}, [lesson, phase]);
	const replay = () => {
		if (phase.kind === "teach") {
			const step = lesson.teach[phase.index];
			playQueue([step.pairAudio, step.enAudio]);
			return;
		}
		if (phase.kind === "quiz") {
			playClip(lesson.quiz[phase.index].promptAudio);
			return;
		}
		playClip("/audio/sl-konec.mp3");
	};
	const goNextTeach = () => {
		if (phase.kind !== "teach") return;
		if (phase.index + 1 < lesson.teach.length) {
			setPhase({
				kind: "teach",
				index: phase.index + 1
			});
			return;
		}
		setPhase({
			kind: "quiz",
			index: 0
		});
	};
	const pick = async (optionId, step) => {
		if (phase.kind !== "quiz" || locked.current) return;
		locked.current = true;
		setChoice(optionId);
		if (optionId === step.correctId) {
			setChoiceState("ok");
			await playQueue(["/audio/chime-ok.mp3", "/audio/sl-tako-je.mp3"]);
			if (phase.index + 1 < lesson.quiz.length) setPhase({
				kind: "quiz",
				index: phase.index + 1
			});
			else {
				const earned = starsFromMistakes(mistakes.current);
				setStars(lesson.id, earned);
				setPhase({
					kind: "done",
					stars: earned
				});
			}
		} else {
			mistakes.current += 1;
			setChoiceState("miss");
			await playQueue(["/audio/chime-no.mp3", "/audio/sl-poskusi.mp3"]);
			setChoice(null);
			setChoiceState("idle");
			locked.current = false;
			playClip(step.promptAudio);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-paper px-4 pb-10 pt-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeakButton, {
						onPress: replay,
						label: "Poslušaj"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-14" })
				]
			}),
			phase.kind === "teach" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeachView, {
				lesson,
				index: phase.index,
				onNext: goNextTeach
			}) : null,
			phase.kind === "quiz" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizView, {
				lesson,
				step: lesson.quiz[phase.index],
				choice,
				choiceState,
				onPick: pick
			}) : null,
			phase.kind === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneView, {
				stars: phase.stars,
				onHome: () => {
					stopSpeech();
					navigate({ to: "/" });
				}
			}) : null
		]
	});
}
function TeachView({ lesson, index, onNext }) {
	const step = lesson.teach[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-1 flex-col items-center justify-center gap-6 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureCard, {
				src: step.picture.src,
				alt: step.picture.alt,
				className: "w-full max-w-md"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-full text-balance text-center font-medium tracking-[0.08em] text-ink text-4xl sm:text-5xl",
				children: step.word
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Naprej",
				onClick: onNext,
				className: "grid size-20 place-items-center rounded-full bg-sage text-sage-fg shadow-[var(--shadow-card)] transition-transform duration-150 ease-out active:scale-[0.96]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
					className: "size-9",
					strokeWidth: 2.2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dots, {
				total: lesson.teach.length,
				index
			})
		]
	});
}
function QuizView({ lesson, step, choice, choiceState, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-1 flex-col items-center justify-center gap-5 pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid w-full grid-cols-2 gap-3 sm:gap-5",
			children: step.optionIds.map((id) => {
				const pic = PICTURES[id];
				if (!pic) return null;
				const state = choice === id ? choiceState : "idle";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureCard, {
					src: pic.src,
					alt: pic.alt,
					state,
					onClick: () => onPick(id, step)
				}, id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dots, {
			total: lesson.quiz.length,
			index: lesson.quiz.indexOf(step)
		})]
	});
}
function DoneView({ stars, onHome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-1 flex-col items-center justify-center gap-6 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureCard, {
				src: "/images/dora-happy.jpg",
				alt: "",
				className: "w-full max-w-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
				value: stars,
				size: "lg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Domov",
				onClick: onHome,
				className: "grid size-20 place-items-center rounded-full bg-sage text-sage-fg shadow-[var(--shadow-card)] transition-transform duration-150 ease-out active:scale-[0.96]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, {
					className: "size-9",
					strokeWidth: 2.2
				})
			})
		]
	});
}
function Dots({ total, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2",
		"aria-hidden": true,
		children: Array.from({ length: total }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: i === index ? "size-2.5 rounded-full bg-sage" : "size-2.5 rounded-full bg-paper-deep" }, i))
	});
}
function LessonPage() {
	const { id } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonPlay, { id });
}
//#endregion
export { LessonPage as component };
