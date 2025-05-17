"use client";

import { useTheme } from "next-themes";

import { MoonIcon } from "../icons/animated/moon";
import { SunIcon } from "../icons/animated/sun";
import { useEffect, useState } from "react";
import { Var, T } from "gt-next";

export function SidebarThemeSwitch() {
	const [isRendered, setIsRendered] = useState(false);
	const { theme, resolvedTheme, setTheme } = useTheme();

	// Prevents hydration error
	useEffect(() => setIsRendered(true), []);

	async function handleThemeToggle() {
		const newTheme = theme === "dark" ? "light" : "dark";

		function update() {
			setTheme(newTheme);
		}

		if (document.startViewTransition && newTheme !== resolvedTheme) {
			document.documentElement.style.viewTransitionName = "theme-transition";
			await document.startViewTransition(update).finished;
			document.documentElement.style.viewTransitionName = "";
		} else {
			update();
		}
	}

	if (!isRendered) return null;

	return (
		<T id="components.theme.sidebar_theme_switcher.0">
			<div
				onClick={handleThemeToggle}
				className="flex cursor-pointer items-center gap-2 text-[13px]"
			>
				<Var>
					{theme === "dark" ? (
						<MoonIcon className="opacity-60" />
					) : (
						<SunIcon className="opacity-60" />
					)}
				</Var>
				<p className="text-[13px] opacity-60">App Theme</p>
			</div>
		</T>
	);
}
