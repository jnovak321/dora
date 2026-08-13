import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as playClip, n as ParentSlot, s as stopSpeech } from "./icon-nav-BZUCGdea.mjs";
import { i as Stars, r as SpeakButton, s as useProgress, t as LESSONS } from "./progress-A4auGcFE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BVapZMdD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useHasHydrated() {
	const [ok, setOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const finish = () => setOk(true);
		const unsub = useProgress.persist.onFinishHydration(finish);
		if (useProgress.persist.hasHydrated()) finish();
		return unsub;
	}, []);
	return ok;
}
function Home() {
	const hydrated = useHasHydrated();
	const started = useProgress((s) => s.started);
	const start = useProgress((s) => s.start);
	const stars = useProgress((s) => s.stars);
	(0, import_react.useEffect)(() => {
		return () => stopSpeech();
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-paper" });
	if (!started) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-7 bg-paper px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/welcome.jpg",
					alt: "",
					className: "aspect-[4/3] w-full rounded-[calc(var(--radius-lg)-6px)] object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-3xl font-medium tracking-wide text-ink",
				children: "Dora"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeakButton, {
				large: true,
				label: "Začni",
				onPress: () => {
					start();
					playClip("/audio/sl-pozdravljena.mp3");
				}
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-paper px-4 pb-12 pt-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeakButton, {
						label: "Poslušaj",
						onPress: () => void playClip("/audio/sl-izberi.mp3")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentSlot, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/welcome.jpg",
					alt: "",
					className: "aspect-[16/9] w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-[50%_30%]"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4",
				children: LESSONS.map((lesson) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/lekcija/$id",
					params: { id: lesson.id },
					"aria-label": lesson.coverAlt,
					onClick: () => stopSpeech(),
					className: "flex flex-col items-center gap-2 rounded-[var(--radius-md)] bg-sheet p-1 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: lesson.cover,
						alt: "",
						className: "aspect-square w-full rounded-[calc(var(--radius-md)-4px)] object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
						value: stars[lesson.id] ?? 0,
						size: "sm"
					})]
				}, lesson.id))
			})
		]
	});
}
//#endregion
export { Home as component };
