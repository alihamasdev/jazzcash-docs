import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

const openapi = createOpenAPI({
	input: ["./openapi.json"],
});

const sectionOrder: Record<string, string[]> = {
	cards: [
		"cardsInitiateAuthentication",
		"cardsAuthenticatePayer",
		"cardsDirectPay",
		"cardsAuthorize",
		"cardsCapture",
		"cardsRetrieveOrder",
	],
	"mobile-wallet": ["mobileWalletV1", "mobileWalletPayV2CNIC", "mobileWalletPayV3HostedMPIN", "mobileWalletPayV4Recurring"],
	vouchers: ["vouchersCreatePayment", "vouchersExpire"],
	"bank-accounts": ["bankValidateCustomer", "bankAccountPayment", "bankGetAvailableBanks"],
	tokenization: ["tokenRetrieve", "tokenInquire", "tokenUpdate", "tokenDelete"],
	refund: ["refundMobileAccount", "refundCard", "refundVoucher"],
};

const sectionTitles: Record<string, string> = {
	cards: "Cards",
	"mobile-wallet": "Mobile Wallet",
	vouchers: "Vouchers",
	"bank-accounts": "Bank Accounts",
	tokenization: "Tokenization",
	refund: "Refund",
};

async function main() {
	await generateFiles({
		input: openapi,
		output: "./content/docs/api-reference",
		per: "operation",
		groupBy: "tag",
		beforeWrite(files) {
			// Generate each subfolder's meta.json automatically
			for (const [folder, title] of Object.entries(sectionTitles)) {
				const expectedPages = sectionOrder[folder] || [];
				// Collect any generated mdx files belonging to this folder
				const mdxInFolder = files
					.filter((f) => f.path.startsWith(`${folder}/`) && f.path.endsWith(".mdx"))
					.map((f) => f.path.slice(folder.length + 1).replace(/\.mdx$/, ""));

				// Maintain defined order first, then append any new operations
				const orderedPages = [
					...expectedPages.filter((p) => mdxInFolder.includes(p)),
					...mdxInFolder.filter((p) => !expectedPages.includes(p)),
				];

				files.push({
					path: `${folder}/meta.json`,
					content: JSON.stringify(
						{
							title,
							pages: orderedPages,
						},
						null,
						2,
					),
				});
			}

			// Generate root api-reference/meta.json with flat labels and folder spreading (...folder)
			const rootPages = [
				"index",
				"response-codes",
				"---Cards---",
				"...cards",
				"---Mobile Wallet---",
				"...mobile-wallet",
				"---Vouchers---",
				"...vouchers",
				"---Bank Accounts---",
				"...bank-accounts",
				"---Tokenization---",
				"...tokenization",
				"---Refund---",
				"...refund",
			];

			files.push({
				path: "meta.json",
				content: JSON.stringify(
					{
						title: "API Reference",
						root: true,
						pages: rootPages,
					},
					null,
					2,
				),
			});
		},
	});
	console.log("Fumadocs OpenAPI pages and meta.json files generated successfully.");

	console.log("Running check command...");
	const { execSync } = await import("node:child_process");
	execSync("npm run check", { stdio: "inherit" });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
