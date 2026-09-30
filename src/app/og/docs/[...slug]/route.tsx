import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

import { getPageImageUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export const revalidate = false;

const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const outfitRegular = fs.readFileSync(path.join(process.cwd(), "public", "fonts", "Outfit-Regular.ttf"));
const outfitBold = fs.readFileSync(path.join(process.cwd(), "public", "fonts", "Outfit-Bold.ttf"));

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) notFound();

	const title = page.data.title;
	const description = page.data.description;
	const titleFontSize = title.length > 28 ? 64 : title.length > 18 ? 72 : 80;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				backgroundColor: "#000000",
				position: "relative",
				fontFamily: "Outfit",
			}}
		>
			{/* Top horizontal grid line */}
			<div
				style={{
					position: "absolute",
					top: 60,
					left: 0,
					right: 0,
					height: 1,
					backgroundColor: "rgba(255, 255, 255, 0.12)",
				}}
			/>
			{/* Bottom horizontal grid line */}
			<div
				style={{
					position: "absolute",
					bottom: 60,
					left: 0,
					right: 0,
					height: 1,
					backgroundColor: "rgba(255, 255, 255, 0.12)",
				}}
			/>
			{/* Left vertical grid line */}
			<div
				style={{
					position: "absolute",
					left: 60,
					top: 0,
					bottom: 0,
					width: 1,
					backgroundColor: "rgba(255, 255, 255, 0.12)",
				}}
			/>
			{/* Right vertical grid line */}
			<div
				style={{
					position: "absolute",
					right: 60,
					top: 0,
					bottom: 0,
					width: 1,
					backgroundColor: "rgba(255, 255, 255, 0.12)",
				}}
			/>

			{/* Main inner card content */}
			<div
				style={{
					position: "absolute",
					top: 60,
					left: 60,
					right: 60,
					bottom: 60,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "0 72px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							fontSize: titleFontSize,
							fontWeight: 800,
							color: "#ffffff",
							letterSpacing: "-0.04em",
							lineHeight: 1.1,
							marginBottom: 24,
							fontFamily: "Outfit",
						}}
					>
						{title}
					</div>
					{description && (
						<div
							style={{
								fontSize: 32,
								fontWeight: 400,
								color: "#a1a1aa",
								letterSpacing: "-0.01em",
								lineHeight: 1.4,
								maxWidth: 820,
								fontFamily: "Outfit",
							}}
						>
							{description}
						</div>
					)}
				</div>

				{/* Bottom right logo mark */}
				<div
					style={{
						position: "absolute",
						bottom: 48,
						right: 48,
						display: "flex",
					}}
				>
					<img
						src={logoBase64}
						width={48}
						height={48}
						alt="JazzCash"
						style={{
							objectFit: "contain",
						}}
					/>
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Outfit",
					data: outfitRegular,
					weight: 400,
					style: "normal",
				},
				{
					name: "Outfit",
					data: outfitBold,
					weight: 800,
					style: "normal",
				},
			],
		},
	);
}

export function generateStaticParams() {
	return source.getPages().map((page) => ({
		lang: page.locale,
		slug: getPageImageUrl(page).segments,
	}));
}
