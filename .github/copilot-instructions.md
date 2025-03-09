# GitHub Configurator - Copilot Instructions

## Project Overview

This project is a GitHub Configurator built as a Cloudflare Worker using the Hono framework. It provides a service to automate GitHub repository configurations and settings.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (lightweight, fast web framework)
- **Language**: TypeScript
- **Package Manager**: pnpm

## Project Structure

- `/src`: Source code
  - `index.ts`: Main entry point for the worker
- `.github`: GitHub-related configuration files
- `wrangler.jsonc`: Cloudflare Workers configuration

## Development Guidelines

### TypeScript

- Use strict TypeScript with proper type definitions
- Follow ESNext standards
- Prefer async/await over raw promises

### API Design

- RESTful API principles
- Use Hono's context (`c`) object for request and response handling
- Implement proper error handling and status codes

### Cloudflare Workers

- Remember that Workers run in a V8 isolate environment
- Be mindful of execution time limits (CPU time is limited)
- Use appropriate Cloudflare features like KV, Durable Objects when needed

## Common Operations

### Adding a new API Endpoint

1. Define the route in `src/index.ts` or create a separate router module
2. Implement the handler function
3. Add appropriate validation and error handling
4. Document the API endpoint

### Working with GitHub API

When implementing GitHub API interactions:

1. Use appropriate authentication methods
2. Implement webhook validation if using webhooks
3. Consider using Octokit or similar libraries for GitHub API interactions

## Testing

- Test API endpoints for expected behavior
- Test error handling scenarios
- Validate GitHub API interactions

## Deployment

Deployment is handled via Wrangler:

- Development: `pnpm run dev`
- Production: `pnpm run deploy`
