import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
	const sharedOptions = baseOptions();

	return (
		<DocsLayout
			tree={source.getPageTree()}
			{...sharedOptions}
			nav={{ ...sharedOptions.nav, mode: "top" }}
			sidebar={{ collapsible: false, prefetch: false }}
			tabMode="navbar"
		>
			{children}
		</DocsLayout>
	);
}
