<!-- prettier-ignore -->
<div align="center">

<img src="./public/logo.png" alt="JazzCash Logo" height="42" />

# JazzCash Documentation & Developer Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-00d8ff?style=flat-square&logo=react)](https://react.dev/)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-v16.18-7c3aed?style=flat-square)](https://fumadocs.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.4-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Enabled-00a3ee?style=flat-square&logo=anthropic&logoColor=white)](https://modelcontextprotocol.io/)

Community developer documentation, interactive OpenAPI references, and native Model Context Protocol (MCP) server for the JazzCash Payment Gateway (v4.2).

[Overview](#overview) • [Key Features](#key-features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Available Scripts](#available-scripts) • [AI & MCP Integration](#ai--mcp-integration) • [OpenAPI Reference Generation](#openapi-reference-generation) • [Project Structure](#project-structure) • [Deployment](#deployment)

</div>

---

> [!NOTE]
> This project is an independent, community-driven modernization and clone of the official [JazzCash Sandbox Documentation v4.2](https://sandbox.jazzcash.com.pk/SandboxDocumentation/v4.2/index.html). It is not affiliated with, endorsed by, or an official portal of JazzCash, Jazz (VEON), or Mobilink Microfinance Bank.

---

## Overview

**JazzCash Docs** is a high-performance developer portal for the JazzCash payment gateway, engineered with Next.js 16, React 19, Fumadocs, and Tailwind CSS v4. It transforms the legacy v4.2 documentation into an accessible, responsive, and type-safe reference for engineering teams integrating local Pakistani payment instruments.

The portal covers all primary payment channels supported by JazzCash:

- **Mobile Wallets**: Default v1.0, CNIC-enabled v2.0, Hosted MPIN v3.0, and Recurring Billing v4.0.
- **Card Processing**: Mastercard Payment Gateway Services (MPGS) with 3D Secure 2.0 authentication, direct pay, authorization, capture, and retrieval.
- **Over-The-Counter (OTC) Vouchers**: Cash voucher creation, retail outlet settlements, and expiration handling.
- **Direct Bank Accounts**: Customer validation, OTP verification, and bank-to-merchant transfers.
- **Tokenization & Refunds**: Card token lifecycle management and transactional refunds across payment rails.

Beyond human-readable guides, this platform acts as an **AI-first knowledge hub**. It embeds a native [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server (`/api/mcp`), standardized `/llms.txt` and `/llms-full.txt` feeds, and HTTP content negotiation (`Accept: text/markdown`) to let AI coding agents (such as Cursor, Windsurf, Claude Desktop, and Antigravity) query, verify, and implement JazzCash integrations directly from developers' codebases.

## Key Features

- **Comprehensive Gateway Coverage**: End-to-end documentation for Mobile Accounts, 3DS2 Credit/Debit Cards, OTC Cash Vouchers, Direct Bank Accounts, and Card Tokenization.
- **Interactive OpenAPI Reference**: Complete REST and HTTP POST endpoint specifications auto-generated from `openapi.json` into type-safe Fumadocs MDX pages with schema explorers and payload samples.
- **In-Browser Sandbox Proxy**: Built-in server proxy (`/api/proxy`) that eliminates browser CORS barriers for sandbox testing, featuring intelligent status code translation (mapping JazzCash `pp_ResponseCode: 000` to `200 OK`, `110` to `422`, etc.).
- **Native MCP Server**: Real-time Model Context Protocol endpoint at `/api/mcp` providing autonomous tools (`list_pages`, `get_page`, `search`) to AI coding assistants.
- **LLM-Optimized Endpoints**: Native support for `/llms.txt` and `/llms-full.txt` standards for zero-latency context ingestion by AI tools and system prompts.
- **Markdown Content Negotiation**: Route negotiation via `proxy.ts` allows any client to request raw token-efficient Markdown by passing `Accept: text/markdown` or appending `.md` to the URL.
- **Security & Integrity Recipes**: Step-by-step algorithms, sample payloads, and code recipes for calculating HMAC-SHA256 `pp_SecureHash` and verifying Instant Transaction Notification (ITN/IPN) webhooks.
- **Companion TypeScript SDK**: Built alongside [`rawapay`](https://github.com/alihamasdev/rawapay), the open-source Node.js and TypeScript library for initiating and validating JazzCash transactions.
- **Strict Quality Control**: Powered by Rust-based Oxlint and Oxfmt for fast linting, formatting, and strict type verification.

## Architecture

```
                                  Clients & AI Assistants
               (Web Browsers, Cursor, Claude Desktop, Windsurf, Antigravity)
                                             │
                                             ▼
                                     Vercel Edge Router
                       (jazzcash.alihamas.pk / jazzcash.vercel.app)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
             Next.js Static & SSR Routes                  API Route Handlers
                       │                                           │
        ┌──────────────┴──────────────┐             ┌──────────────┼──────────────┬──────────────┐
        ▼                             ▼             ▼              ▼              ▼              ▼
 Documentation Pages           OpenAPI Explorer   /api/mcp     /api/proxy    /api/search   /llms[-full].txt
  (/docs/features,            (/docs/api-ref)   (MCP Server)  (CORS Proxy)  (Doc Search)   (Agent Context)
   /docs/mode-selection)
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.2+ (recommended) or [Node.js](https://nodejs.org/) 20+
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alihamasdev/jazzcash-docs.git
   cd jazzcash-docs
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Start the development server:**

   ```bash
   bun dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the documentation locally.

## Available Scripts

| Script             | Command                             | Description                                                             |
| :----------------- | :---------------------------------- | :---------------------------------------------------------------------- |
| `dev`              | `next dev`                          | Starts the local Next.js development server with Turbopack.             |
| `build`            | `next build`                        | Compiles and builds the production application.                         |
| `start`            | `next start`                        | Runs the compiled production build locally.                             |
| `check`            | `oxlint --fix && oxfmt --write`     | Executes fast Rust-based linting and formatting.                        |
| `check-types`      | `next typegen && tsc --noEmit`      | Generates Next.js route types and runs TypeScript type checking.        |
| `deploy`           | `vercel`                            | Deploys an isolated preview build to Vercel.                            |
| `deploy:prod`      | `vercel --prod`                     | Deploys current tree directly to production on Vercel.                  |
| `generate:openapi` | `bun ./scripts/generate-openapi.ts` | Generates MDX API references and subfolder indices from `openapi.json`. |

## AI & MCP Integration

JazzCash Docs features a native MCP server implementation ([`src/app/api/mcp/route.ts`](src/app/api/mcp/route.ts)) exposing documentation tools directly to AI coding agents.

### Available MCP Tools

- `list_pages`: Returns a structured index of all available documentation pages, guides, and API endpoints.
- `get_page`: Retrieves the complete, token-optimized Markdown content of a specific page path (e.g., `/docs/api-reference/cards` or `/docs/features/hashing-scheme`).
- `search`: Performs full-text fuzzy search across all documentation sections, code recipes, and parameters.

### Connecting Your AI Assistant

#### Cursor

Add the following to your Cursor configuration (`~/.cursor/mcp.json`):

```json
{
	"mcpServers": {
		"safepay-docs": {
			"url": "https://jazzcash.alihamas.pk/api/mcp"
		}
	}
}
```

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
	"mcpServers": {
		"safepay-docs": {
			"url": "https://jazzcash.alihamas.pk/api/mcp"
		}
	}
}
```

#### Antigravity

Add the server to your `~/.gemini/config/mcp_config.json`:

```json
{
	"mcpServers": {
		"safepay-docs": {
			"serverUrl": "https://jazzcash.alihamas.pk/api/mcp"
		}
	}
}
```

### LLM Text Endpoints & Content Negotiation

In addition to the interactive MCP server, you can feed context into LLMs and automated pipelines through standard HTTP endpoints:

- **`/llms.txt`**: Concise directory of all pages with descriptions for fast model discovery.
- **`/llms-full.txt`**: Consolidated single-file documentation corpus ready for one-shot agent ingestion.
- **Raw Markdown Negotiation**: Append `.md` to any documentation URL or send an `Accept: text/markdown` header:

```bash
# Fetch raw Markdown via Accept header
curl -H "Accept: text/markdown" https://jazzcash.alihamas.pk/docs/features/hashing-scheme

# Fetch raw Markdown via .md suffix
curl https://jazzcash.alihamas.pk/docs/api-reference/mobile-wallet/mobileWalletV1.md
```

## OpenAPI Reference Generation

API reference pages under `content/docs/api-reference` are dynamically compiled from the OpenAPI 3.1 specification ([`openapi.json`](openapi.json)).

To regenerate the documentation after modifying `openapi.json`:

```bash
bun run generate:openapi
```

The generator script ([`scripts/generate-openapi.ts`](scripts/generate-openapi.ts)):

1. Parses `openapi.json` using `fumadocs-openapi`.
2. Groups operations by tags (`cards`, `mobile-wallet`, `vouchers`, `bank-accounts`, `tokenization`, `refund`).
3. Automatically synthesizes per-folder `meta.json` navigation trees with deterministic operation order.
4. Generates root navigation spreading (`...cards`, `...mobile-wallet`, etc.) and runs `npm run check`.

## Project Structure

```
jazzcash-docs/
├── content/
│   └── docs/                     # MDX documentation source files
│       ├── api-reference/        # Generated OpenAPI endpoint guides
│       │   ├── bank-accounts/    # Direct bank account APIs
│       │   ├── cards/            # MPGS 3DS 2.0 card payment operations
│       │   ├── mobile-wallet/    # Mobile account v1-v4 payment APIs
│       │   ├── refund/           # Refund APIs across payment rails
│       │   ├── tokenization/     # Card token management endpoints
│       │   └── vouchers/         # OTC cash voucher operations
│       ├── features/             # Hashing, 3DS, tokenization, webhooks (ITN/IPN)
│       └── mode-selection/       # Integration methods and HTTP POST specifications
├── openapi.json                  # Comprehensive OpenAPI 3.1 specification for JazzCash v4.2
├── public/
│   ├── fonts/                    # Custom Outfit typeface assets
│   ├── logo.png                  # High-resolution project branding asset
│   └── *.png                     # Flowcharts and portal UI references
├── scripts/
│   └── generate-openapi.ts       # Automated OpenAPI-to-MDX compilation script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── mcp/route.ts      # Streamable Model Context Protocol handler
│   │   │   ├── proxy/route.ts    # In-browser API playground CORS proxy & status mapper
│   │   │   └── search/route.ts   # Fumadocs search index endpoint
│   │   ├── docs/                 # Documentation route layouts and pages
│   │   ├── llms.txt/             # LLM discovery index endpoint
│   │   ├── llms-full.txt/        # LLM full documentation corpus endpoint
│   │   ├── global.css            # Tailwind CSS v4 design tokens and styling
│   │   └── layout.tsx            # Global layout, fonts, and metadata configuration
│   ├── components/               # Custom MDX widgets, API page renderer, and theme switch
│   ├── lib/                      # Fumadocs source loader, OpenAPI helpers, and site config
│   └── proxy.ts                  # Edge content negotiation middleware
├── next.config.mjs               # Next.js configuration with Fumadocs MDX plugins
└── package.json                  # Dependencies, metadata, and build scripts
```

## Deployment

The project is pre-configured for automated continuous deployment with Vercel:

1. **Serverless Infrastructure**: Zero-config serverless function execution and global edge caching for optimal performance.
2. **CORS & Domain Handlers**: Automatic validation for custom domain `jazzcash.alihamas.pk` alongside all preview deployment subdomains (`*.vercel.app`).
3. **In-Browser Gateway Proxy**: The `/api/proxy` endpoint runs on Fluid Compute to forward test transactions from the documentation playground to JazzCash Sandbox (`https://sandbox.jazzcash.com.pk`) and Production (`https://payments.jazzcash.com.pk`) environments safely without exposing merchant credentials.
