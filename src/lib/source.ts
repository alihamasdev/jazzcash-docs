import { llms, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";

import { getOperationMarkdown } from "./openapi-markdown";
import { docsRoute } from "./shared";

const docs = defineDocs({
	dir: "content/docs",
	docs: {
		schema: pageSchema,
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
	meta: {
		schema: metaSchema,
	},
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
	baseUrl: docsRoute,
	source: docs.toFumadocsSource(),
	plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
	renderPage: async (page) => {
		const lastSlug = page.slugs[page.slugs.length - 1];
		const openapiMarkdown = lastSlug ? getOperationMarkdown(lastSlug) : null;
		const rawProcessed = await page.data.getText("processed");
		const processed = rawProcessed.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").trim();

		if (openapiMarkdown) {
			const extra = processed.length > 0 ? `\n\n${processed}` : "";
			return `# ${page.data.title} (${page.url})${extra}\n\n${openapiMarkdown}`;
		}

		return `# ${page.data.title} (${page.url})\n\n${processed}`;
	},
});
