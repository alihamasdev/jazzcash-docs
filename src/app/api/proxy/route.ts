import { openapi } from "@/lib/openapi";

const proxy = openapi.createProxy({
	allowedOrigins: ["https://sandbox.jazzcash.com.pk", "https://payments.jazzcash.com.pk"],
});

async function handleWithCustomStatus(req: Request) {
	const res = await proxy.handle(req);

	// Check if this is a JSON response from JazzCash
	const contentType = res.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		const text = await res.text();
		try {
			const data = JSON.parse(text);

			// If response contains JazzCash pp_ResponseCode, map it to semantic HTTP status codes
			if (data && typeof data === "object" && "pp_ResponseCode" in data) {
				const code = String(data.pp_ResponseCode ?? "").trim();

				let status = res.status;
				let statusText = res.statusText;

				if (code === "000") {
					// Transaction success
					status = 200;
					statusText = "OK";
				} else if (code === "110") {
					// Invalid field value / validation failure
					status = 422;
					statusText = "Unprocessable Entity";
				} else if (code.length > 0) {
					// Other business/gateway failure codes (e.g. 101, 105, 115, etc.)
					status = 400;
					statusText = "Bad Request";
				}

				return new Response(text, {
					status,
					statusText,
					headers: res.headers,
				});
			}

			return new Response(text, {
				status: res.status,
				statusText: res.statusText,
				headers: res.headers,
			});
		} catch {
			return new Response(text, {
				status: res.status,
				statusText: res.statusText,
				headers: res.headers,
			});
		}
	}

	return res;
}

export const GET = handleWithCustomStatus;
export const POST = handleWithCustomStatus;
export const PUT = handleWithCustomStatus;
export const DELETE = handleWithCustomStatus;
export const PATCH = handleWithCustomStatus;
export const HEAD = handleWithCustomStatus;
