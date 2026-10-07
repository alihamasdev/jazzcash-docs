import { docsLlms, source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	const tree = source.getPageTree();
	const apiRefNode = tree.children.find(
		(child) => child.type === "folder" && (child.$id === "api-reference" || child.name === "API Reference"),
	);

	const docsIndex = await docsLlms.index();
	if (!apiRefNode) return new Response(docsIndex);

	const apiIndex = await docsLlms.indexNode(apiRefNode);
	return new Response(`${docsIndex}\n\n# API Reference\n\n${apiIndex}`);
}
