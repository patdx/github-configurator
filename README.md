# GitHub Configurator

A Cloudflare Workers application that helps you configure GitHub repositories with "squash merge only" settings from a single dashboard.

## Features

- OAuth authentication with GitHub
- View all your repositories and their current merge settings
- Configure repositories to use squash merges only with one click
- Responsive UI built with Hono JSX renderer

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v10 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (installed as a dev dependency)
- A GitHub account
- A [GitHub OAuth App](https://github.com/settings/developers)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/github-configurator.git
cd github-configurator
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a GitHub OAuth App:

   - Go to GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
   - Set the Homepage URL to `http://localhost:8787` for development
   - Set the Authorization callback URL to `http://localhost:8787/auth/github/callback`
   - Note the Client ID and Client Secret

4. Configure environment variables:
   - Open `wrangler.jsonc` and fill in your GitHub OAuth credentials:

```jsonc
"vars": {
  "GITHUB_ID": "your-client-id",
  "GITHUB_SECRET": "your-client-secret"
}
```

- For production, you can use Cloudflare's environment variables:

```bash
wrangler secret put GITHUB_ID
wrangler secret put GITHUB_SECRET
```

## Development

Run the local development server:

```bash
pnpm run dev
```

This will start a local development server at http://localhost:8787.

## Deployment

Deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

Remember to update your GitHub OAuth App's callback URL to your production URL.

## Project Structure

- `/src`: Source code
  - `index.tsx`: Main entry point for the worker
  - `components/`: JSX components for UI building
  - `layouts/`: Layout components using JSX
  - `utils/`: Utility functions for authentication and GitHub API
- `wrangler.jsonc`: Cloudflare Workers configuration

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Language**: TypeScript
- **Authentication**: GitHub OAuth
- **API Client**: Octokit

## License

MIT
