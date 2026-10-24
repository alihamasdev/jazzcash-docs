import openapiData from "~/openapi.json";

interface OpenAPISchema {
	$ref?: string;
	title?: string;
	type?: string;
	description?: string;
	example?: unknown;
	examples?: unknown[];
	enum?: (string | number)[];
	required?: string[];
	properties?: Record<string, OpenAPISchema>;
	oneOf?: OpenAPISchema[];
}

interface OpenAPIOperation {
	operationId?: string;
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: Array<{
		name: string;
		in: "query" | "header" | "path" | "cookie";
		required?: boolean;
		description?: string;
		schema?: OpenAPISchema;
	}>;
	requestBody?: {
		description?: string;
		required?: boolean;
		content?: Record<
			string,
			{
				schema?: OpenAPISchema;
				example?: unknown;
				examples?: Record<string, { value?: unknown }>;
			}
		>;
	};
	responses?: Record<
		string,
		{
			description?: string;
			content?: Record<
				string,
				{
					schema?: OpenAPISchema;
					example?: unknown;
					examples?: Record<string, { value?: unknown }>;
				}
			>;
		}
	>;
}

interface OpenAPIObject {
	openapi?: string;
	servers?: Array<{ url: string; description?: string }>;
	paths: Record<string, Record<string, OpenAPIOperation>>;
	components?: {
		schemas?: Record<string, OpenAPISchema>;
	};
}

const openapi = openapiData as unknown as OpenAPIObject;

// Pre-index operations by operationId for fast lookup
const operationsById = new Map<string, { operation: OpenAPIOperation; path: string; method: string }>();

for (const [path, methods] of Object.entries(openapi.paths || {})) {
	for (const [method, op] of Object.entries(methods)) {
		if (op.operationId) {
			operationsById.set(op.operationId, { operation: op, path, method });
		}
	}
}

function resolveRef(ref?: string): OpenAPISchema | null {
	if (!ref || !ref.startsWith("#/")) return null;
	const parts = ref.replace("#/", "").split("/");
	let curr: unknown = openapi;
	for (const part of parts) {
		if (curr && typeof curr === "object" && part in curr) {
			curr = (curr as Record<string, unknown>)[part];
		} else {
			return null;
		}
	}
	return (curr as OpenAPISchema) || null;
}

function resolveSchema(schema?: OpenAPISchema): OpenAPISchema | null {
	if (!schema) return null;
	if (schema.$ref) {
		const resolved = resolveRef(schema.$ref);
		return resolved ? { ...resolved, ...schema, $ref: undefined } : schema;
	}
	return schema;
}

function cleanString(val: string): string {
	return val.replace(/\\"/g, '"').replace(/\\\\/g, "\\").trim();
}

function generateExample(schemaInput?: OpenAPISchema): unknown {
	const schema = resolveSchema(schemaInput);
	if (!schema) return null;

	if (schema.examples && schema.examples.length > 0) {
		const ex = schema.examples[0];
		return typeof ex === "string" ? cleanString(ex) : ex;
	}
	if (schema.example !== undefined) {
		return typeof schema.example === "string" ? cleanString(schema.example) : schema.example;
	}
	if (schema.enum && schema.enum.length > 0) {
		return schema.enum[0];
	}

	if (schema.type === "object" || schema.properties) {
		const obj: Record<string, unknown> = {};
		for (const [key, prop] of Object.entries(schema.properties || {})) {
			obj[key] = generateExample(prop);
		}
		return obj;
	}

	if (schema.type === "string") {
		return "string";
	}
	if (schema.type === "number" || schema.type === "integer") {
		return 0;
	}
	if (schema.type === "boolean") {
		return true;
	}

	return "";
}

function formatType(prop: OpenAPISchema): string {
	if (prop.enum && prop.enum.length > 0) {
		return prop.enum.map((v) => `"${v}"`).join(", ");
	}
	return prop.type || "string";
}

function cleanDescription(desc?: string): string {
	if (!desc) return "-";
	let s = desc.replace(/\n+/g, " ").trim();
	// Escape pipes inside markdown tables
	s = s.replace(/\|/g, "\\|");
	// Prevent trailing backslash from escaping the table pipe delimiter
	if (s.endsWith("\\")) {
		s += "\\";
	}
	return s;
}

function formatExample(val: unknown): string {
	if (val === undefined || val === null || val === "") return "-";
	const str = cleanString(String(val));
	return `"${str}"`;
}

function renderAlignedTable(headers: string[], rows: string[][]): string {
	const colWidths = headers.map((h, i) => {
		let max = h.length;
		for (const r of rows) {
			if (r[i] && r[i].length > max) max = r[i].length;
		}
		return max;
	});

	const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

	const headerLine = "| " + headers.map((h, i) => pad(h, colWidths[i]!)).join(" | ") + " |";
	const separatorLine = "| " + colWidths.map((w) => ":" + "-".repeat(Math.max(3, w - 1))).join(" | ") + " |";
	const rowLines = rows.map((r) => "| " + r.map((c, i) => pad(c, colWidths[i]!)).join(" | ") + " |");

	return [headerLine, separatorLine, ...rowLines].join("\n");
}

function renderSchemaTable(schemaInput?: OpenAPISchema): string {
	const schema = resolveSchema(schemaInput);
	if (!schema || !schema.properties) return "";

	const requiredSet = new Set(schema.required || []);
	const headers = ["Parameter", "Type", "Required", "Description", "Example"];
	const rows: string[][] = [];

	for (const [key, rawProp] of Object.entries(schema.properties)) {
		const prop = resolveSchema(rawProp) || rawProp;
		const isRequired = requiredSet.has(key) ? "`true`" : "`false`";
		const type = formatType(prop);
		const desc = cleanDescription(prop.description);
		const exampleVal = prop.examples?.[0] ?? prop.example;
		const exampleStr = formatExample(exampleVal);

		rows.push([`\`${key}\``, type, isRequired, desc, exampleStr]);
	}

	return renderAlignedTable(headers, rows);
}

export function getOperationMarkdown(operationId: string): string | null {
	const entry = operationsById.get(operationId);
	if (!entry) return null;

	const { operation: op, path, method } = entry;
	const parts: string[] = [];

	parts.push(`\`${method.toUpperCase()} ${path}\`\n`);

	if (op.description) {
		parts.push(`${op.description}\n`);
	}

	parts.push(
		`### Endpoints\n- **Sandbox**: \`https://sandbox.jazzcash.com.pk/ApplicationAPI/API${path}\`\n- **Production**: \`https://payments.jazzcash.com.pk/ApplicationAPI/API${path}\`\n`,
	);

	if (op.parameters && op.parameters.length > 0) {
		parts.push(`### Parameters\n`);
		const headers = ["Parameter", "In", "Type", "Required", "Description"];
		const rows: string[][] = [];
		for (const p of op.parameters) {
			const type = p.schema ? formatType(p.schema) : "string";
			const req = p.required ? "`true`" : "`false`";
			const desc = cleanDescription(p.description);
			rows.push([`\`${p.name}\``, `\`${p.in}\``, type, req, desc]);
		}
		parts.push(renderAlignedTable(headers, rows));
		parts.push("");
	}

	const reqContent = op.requestBody?.content?.["application/json"];
	if (reqContent?.schema) {
		parts.push(`### Request Body (\`application/json\`)\n`);
		const schema = reqContent.schema;

		if (schema.oneOf && schema.oneOf.length > 0) {
			parts.push(`This endpoint accepts one of the following request schemas:\n`);
			schema.oneOf.forEach((variant, index) => {
				const resolved = resolveSchema(variant) || variant;
				const title = resolved.title || `Option ${index + 1}`;
				parts.push(`#### ${title}\n`);
				parts.push(renderSchemaTable(resolved));

				const example = generateExample(resolved);
				if (example) {
					parts.push(`\n**Example Request Payload (${title}):**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n`);
				}
			});
		} else {
			const resolved = resolveSchema(schema) || schema;
			parts.push(renderSchemaTable(resolved));

			const example = generateExample(resolved);
			if (example) {
				parts.push(`\n**Example Request Payload:**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n`);
			}
		}
	}

	if (op.responses) {
		parts.push(`### Responses\n`);
		for (const [code, resp] of Object.entries(op.responses)) {
			const label = code === "200" ? "200 OK" : code;
			parts.push(`#### \`${label}\`\n`);
			if (resp.description) {
				parts.push(`${resp.description}\n`);
			}

			const respContent = resp.content?.["application/json"];
			if (respContent?.schema) {
				const resolved = resolveSchema(respContent.schema) || respContent.schema;
				parts.push(renderSchemaTable(resolved));

				const example = generateExample(resolved);
				if (example) {
					parts.push(`\n**Example Response Payload:**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n`);
				}
			}
		}
	}

	return parts.join("\n");
}
