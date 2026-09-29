import { RootProvider } from "fumadocs-ui/provider/next";
import { Roboto, Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/cn";

import "./global.css";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-sans",
});

const robotoHeading = Roboto({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
	variable: "--font-heading",
});

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-mono",
});

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={cn(roboto.variable, robotoHeading.variable, robotoMono.variable)} suppressHydrationWarning>
			<body className="isolate flex min-h-dvh flex-col font-sans antialiased">
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
