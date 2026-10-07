"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { cn } from "@/lib/cn";

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		const next = resolvedTheme === "dark" ? "light" : "dark";
		if (document?.startViewTransition) {
			document.startViewTransition(() => {
				flushSync(() => {
					setTheme(next);
				});
			});
		} else {
			setTheme(next);
		}
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className={cn(buttonVariants({ size: "icon-sm", variant: "ghost", className: "text-fd-muted-foreground" }))}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
			</svg>
		</button>
	);
}
