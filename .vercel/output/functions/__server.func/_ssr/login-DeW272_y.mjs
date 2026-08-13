import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GROK_PROVIDERS } from "./router-Bk0dHsDj.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as signIn, r as cn, t as HomeLink } from "./icon-nav-BZUCGdea.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			solid: "bg-sage text-sage-fg shadow-[var(--shadow-card)] hover:bg-ink",
			sheet: "bg-sheet text-ink shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
			ghost: "bg-transparent text-ink hover:bg-paper-deep",
			clay: "bg-clay text-clay-fg shadow-[var(--shadow-card)] hover:bg-ink"
		},
		size: {
			md: "h-12 rounded-[var(--radius-sm)] px-5 text-base",
			lg: "h-16 rounded-[var(--radius-md)] px-7 text-lg",
			icon: "size-16 rounded-full",
			tile: "size-20 rounded-full"
		}
	},
	defaultVariants: {
		variant: "solid",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 bg-paper px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-40 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/dora.jpg",
					alt: "",
					className: "aspect-square w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-top"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl font-medium tracking-wide text-ink",
				children: "Starši"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full flex-col gap-3",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "sheet",
					size: "lg",
					onClick: () => signIn(p.providerId, { callbackURL: "/" }),
					children: p.label
				}, p.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-base text-ink-soft underline-offset-4 hover:underline",
				children: "←"
			})
		]
	});
}
//#endregion
export { Login as component };
