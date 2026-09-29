import Image from "next/image";

import Logo from "~/public/logo.png";

import { appName, gitConfig } from "./shared";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const navTitle = (
	<span className="inline-flex items-center gap-2">
		<Image src={Logo} alt={appName} width={24} height={24} priority />
		<span className="font-heading text-base font-semibold">{appName}</span>
	</span>
);

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: navTitle,
			url: "/docs",
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
