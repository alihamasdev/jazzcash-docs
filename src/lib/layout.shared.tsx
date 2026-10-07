import { type BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

import Logo from "~/public/logo.png";

import { appName, gitConfig } from "./shared";

const navTitle = (
	<div className="inline-flex items-center gap-2">
		<Image src={Logo} alt={appName} width={24} height={24} priority />
		<span className="font-heading text-base/7 font-semibold">{appName}</span>
		<span className="text-xs text-muted-foreground">v4.2</span>
	</div>
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
