import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { BookIcon, CodeIcon } from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
	const sharedOptions = baseOptions();

	return (
		<DocsLayout
			tree={source.getPageTree()}
			{...sharedOptions}
			slots={{ themeSwitch: ThemeSwitch }}
			nav={{ ...sharedOptions.nav, mode: "top" }}
			sidebar={{ collapsible: false, prefetch: false }}
			tabs={[
				{ title: "Documentation", url: "/docs", icon: <BookIcon className="size-4" /> },
				{ title: "API Reference", url: "/docs/api-reference", icon: <CodeIcon className="size-4" /> },
			]}
			tabMode="navbar"
		>
			{children}
		</DocsLayout>
	);
}
