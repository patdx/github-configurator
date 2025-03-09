# GitHub Configurator: Repository Settings Manager

## Project Overview

A Cloudflare Worker application using Hono framework to configure GitHub repositories with "squash merge only" settings. This tool will allow users to manage merge configurations across multiple repositories from a single dashboard.

## User Flow

1. User visits the application
2. User authenticates via GitHub OAuth (server-side auth)
3. Application fetches user's repositories and their current merge settings
4. User sees a dashboard with repositories listed, showing:
   - Repository name
   - Current merge configuration status
   - "Configure" button for repositories not yet set to "squash merge only"
5. When user clicks "Configure" on a repository, the application:
   - Makes API call to GitHub to update the repository settings
   - Updates the UI to reflect the new configuration
   - Provides success/error feedback

## Technical Architecture

### Frontend Components

- Login page with GitHub authentication button
- Repository list dashboard
- Configuration status indicators
- Action buttons
- Success/error notifications
- Using Hono JSX rendering for server-side HTML generation

### Backend Services

- GitHub OAuth authentication flow
- GitHub API integration for:
  - Fetching repositories
  - Fetching repository settings
  - Updating repository settings
- Cloudflare Worker endpoints

## API Endpoints

1. **Authentication Endpoints**

   - `/auth/github`: Initiates GitHub OAuth flow
   - `/auth/github/callback`: Handles OAuth callback and token generation

2. **Repository Endpoints**
   - `/api/repos`: Fetches user's repositories with current settings
   - `/api/repos/:owner/:repo/configure`: Configures specific repository to "squash merge only"

## Data Models

### User Session

- GitHub access token
- User information

### Repository

- Repository ID
- Repository name
- Owner
- Current merge settings
- Configuration status

## Technical Requirements

### GitHub API Integration

- GitHub OAuth App registration
- Required scopes: `repo` for private repositories, `public_repo` for public repositories
- API endpoints for repository settings: `PATCH /repos/:owner/:repo`
- Parameter for squash merge: `{ "allow_squash_merge": true, "allow_merge_commit": false, "allow_rebase_merge": false }`

### Authentication

- Server-side authentication flow
- Secure token storage
- Session management

### UI Development

- Server-side rendering using Hono JSX renderer
- Simple, responsive UI components
- Clear status indicators for repository configuration
- Loading states for asynchronous operations

## Implementation Phases

### Phase 1: Setup & Authentication

- Create GitHub OAuth App
- Implement authentication endpoints
- Setup secure session handling
- Set up Hono JSX templating

### Phase 2: Repository Management

- Implement repository fetching
- Display repository list with current settings
- Create repository configuration endpoint

### Phase 3: UI/UX

- Build user interface components with JSX
- Implement interactive elements
- Add notification system for actions

### Phase 4: Testing & Deployment

- Test authentication flow
- Test repository configuration
- Deploy to Cloudflare Workers

## Future Enhancements

- Bulk configuration of multiple repositories
- Additional repository settings management
- Configuration templates/profiles
- Activity logs and audit trail
- Schedule periodic checks for configuration drift

## Security Considerations

- Secure handling of GitHub tokens
- Proper scoping of GitHub permissions
- Protection against CSRF attacks
- Rate limiting to prevent API abuse

## Dependencies

- Hono framework
- Hono JSX renderer
- GitHub API client (Octokit.js)
- Authentication libraries
- No external UI libraries
