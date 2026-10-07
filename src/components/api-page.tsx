"use client";

import { createCodeUsageGeneratorRegistry } from "fumadocs-openapi/requests/generators";
import { type CodeUsageGenerator } from "fumadocs-openapi/requests/generators";
import { curl } from "fumadocs-openapi/requests/generators/curl";
import { javascript } from "fumadocs-openapi/requests/generators/javascript";
import { python } from "fumadocs-openapi/requests/generators/python";
import { createOpenAPIPage } from "fumadocs-openapi/ui";
import { DefaultResultDisplay, type ResultDisplayProps } from "fumadocs-openapi/ui/playground/client";
import { AlertTriangleIcon } from "lucide-react";

function CustomResultDisplay(props: ResultDisplayProps) {
	const status = props.data.type === "response" ? props.data.status : null;
	const isAlteredStatus = status === 422 || status === 400;

	return (
		<div className="flex flex-col flex-1 min-h-0">
			{isAlteredStatus && (
				<div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
					<AlertTriangleIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
					<div className="leading-relaxed">
						<span className="font-semibold text-amber-950 dark:text-amber-100">
							Playground Notice ({status} {status === 422 ? "Unprocessable Entity" : "Bad Request"}):
						</span>{" "}
						This HTTP status code was mapped by this documentation playground for developer clarity. In live production and sandbox,{" "}
						<strong>JazzCash always returns HTTP 200 OK</strong> even when a transaction fails or validation fails (with failure codes in{" "}
						<code>pp_ResponseCode</code>). JazzCash only returns non-200 codes (like 404 or 500) during internal gateway/server outages.
					</div>
				</div>
			)}
			<DefaultResultDisplay {...props} />
		</div>
	);
}

const phpGenerator: CodeUsageGenerator = {
	label: "PHP",
	lang: "php",
	generate(data) {
		const method = data.method.toUpperCase();
		const headers: string[] = [];

		if (data.bodyMediaType) {
			headers.push(`"Content-Type: ${data.bodyMediaType}"`);
		}

		for (const [k, v] of Object.entries(data.header || {})) {
			headers.push(`"${k}: ${v.value}"`);
		}

		let bodyOption = "";
		if (data.body) {
			if (data.bodyMediaType === "application/json") {
				bodyOption = `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${JSON.stringify(data.body, null, 2)}));`;
			} else if (typeof data.body === "string") {
				bodyOption = `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(data.body)});`;
			} else {
				bodyOption = `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(data.body, null, 2)});`;
			}
		}

		const headersCode =
			headers.length > 0
				? `curl_setopt($ch, CURLOPT_HTTPHEADER, [\n${headers.map((h) => "  " + h).join(",\n")}\n]);`
				: `curl_setopt($ch, CURLOPT_HTTPHEADER, []);`;

		return `<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "${data.url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
${headersCode}${bodyOption}

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    echo $response;
}

curl_close($ch);
`;
	},
};

const codeUsages = createCodeUsageGeneratorRegistry();

// Required languages in exact order: Node.js, PHP, Python, curl
codeUsages.add("nodejs", {
	...javascript,
	label: "Node.js",
	lang: "js",
});

codeUsages.add("php", phpGenerator);

codeUsages.add("python", {
	...python,
	label: "Python",
	lang: "python",
});

codeUsages.add("curl", {
	...curl,
	label: "curl",
	lang: "bash",
});

export const OpenAPIPage = createOpenAPIPage({
	codeUsages,
	playground: {
		components: {
			ResultDisplay: CustomResultDisplay,
		},
	},
});
