import { RootProvider } from "fumadocs-ui/provider/next";
import { type Metadata } from "next";
import { Outfit } from "next/font/google";

import { cn } from "@/lib/cn";
import { appName, siteUrl } from "@/lib/shared";

import "./global.css";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${appName} Documentation`,
		template: `%s - ${appName}`,
	},
	description: "Modern, AI-ready developer documentation for the JazzCash Payment Gateway (v4.2).",
};

const sans = Outfit({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const heading = Outfit({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
});

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" data-scroll-behavior="smooth" className={cn("scroll-smooth", sans.variable, heading.variable)} suppressHydrationWarning>
			<body className="isolate flex min-h-dvh flex-col font-sans antialiased">
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
