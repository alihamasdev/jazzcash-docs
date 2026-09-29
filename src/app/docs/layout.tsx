import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { MessageCircleIcon } from "lucide-react";

import { AISearch, AISearchPanel, AISearchTrigger } from "@/components/ai/search";
import { cn } from "@/lib/cn";
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
			<AISearch>
				<AISearchPanel />
				<AISearchTrigger
					position="float"
					className={cn(
						buttonVariants({
							variant: "secondary",
							className: "text-fd-muted-foreground rounded-2xl",
						}),
					)}
				>
					<MessageCircleIcon className="size-4.5" />
					Ask AI
				</AISearchTrigger>
			</AISearch>
			{children}
		</DocsLayout>
	);
}
