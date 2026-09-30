import { createGetUrl } from "fumadocs-core/source";

export const appName = "JazzCash";
export const defaultDomain = "jazzcash.vercel.app";
export const customDomain = "jazzcash.alihamas.pk";

export const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL ||
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: `https://${customDomain || defaultDomain}`);

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
	user: "alihamasdev",
	repo: "jazzcash-docs",
	branch: "main",
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs, "content.md"];

	return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs, "image.png"];

	return { segments, url: getImageUrl(segments, page.locale) };
}
