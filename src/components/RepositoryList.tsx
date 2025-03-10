import { FC, Suspense } from 'hono/jsx'

export type Repository = {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
  }
  html_url: string
  description: string | null
  private: boolean
  allow_squash_merge: boolean
  allow_merge_commit: boolean
  allow_rebase_merge: boolean
  is_squash_merge_only: boolean
}

type RepositoryListProps = {
  repositoryBatches: Promise<Repository[]>[]
  batchSize?: number
}

// Component to render a single repository card
const RepositoryCard: FC<{ repo: Repository }> = ({ repo }) => {
  return (
    <div class="repo-card card" key={repo.id}>
      <div class="repo-header">
        <h3>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.full_name}
          </a>
        </h3>
        <span class={`repo-visibility ${repo.private ? 'private' : 'public'}`}>
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>

      {repo.description && <p class="repo-description">{repo.description}</p>}

      <div class="repo-settings">
        <div class="settings-status">
          <h4>Merge Settings:</h4>
          <ul>
            <li>Squash merges: {repo.allow_squash_merge ? '✅' : '❌'}</li>
            <li>Merge commits: {repo.allow_merge_commit ? '✅' : '❌'}</li>
            <li>Rebase merges: {repo.allow_rebase_merge ? '✅' : '❌'}</li>
          </ul>
        </div>

        <div class="config-status">
          {repo.is_squash_merge_only ? (
            <div class="status-badge status-configured">
              ✓ Configured for squash merges only
            </div>
          ) : (
            <div class="config-actions">
              <div class="status-badge status-unconfigured">
                Not configured for squash merges only
              </div>
              <form
                action={`/api/repos/${repo.owner.login}/${repo.name}/configure`}
                method="post"
              >
                <button type="submit" class="btn">
                  Configure
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Async component that awaits a single batch of repositories data
const AsyncRepositoryBatch: FC<{
  repositoriesPromise: Promise<Repository[]>
  batchIndex: number
}> = async ({ repositoriesPromise, batchIndex }) => {
  const repositories = await repositoriesPromise

  if (repositories.length === 0) {
    return <></>
  }

  return (
    <div class="repos-batch" data-batch={batchIndex}>
      {repositories.map((repo) => (
        <RepositoryCard repo={repo} />
      ))}
    </div>
  )
}

// Main component that uses multiple Suspense boundaries
export const RepositoryList: FC<RepositoryListProps> = ({
  repositoryBatches,
  batchSize = 10,
}) => {
  return (
    <div class="repository-list">
      <h2>Your Repositories</h2>

      <div class="repos-container">
        {repositoryBatches.length > 0 ? (
          repositoryBatches.map((batch, index) => (
            <Suspense
              fallback={
                <div class="loading-indicator">
                  Loading batch {index + 1}...
                </div>
              }
            >
              <AsyncRepositoryBatch
                repositoriesPromise={batch}
                batchIndex={index}
              />
            </Suspense>
          ))
        ) : (
          <p>No repositories available.</p>
        )}
      </div>

      <style>{`
        .repository-list {
          margin: 2rem 0;
        }
        .repository-list h2 {
          margin-bottom: 1.5rem;
        }
        .loading-indicator {
          padding: 2rem;
          text-align: center;
          background-color: #f6f8fa;
          border-radius: 6px;
          border: 1px dashed var(--color-border);
          margin-bottom: 1rem;
        }
        .repos-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .repos-batch {
          display: contents;
        }
        .repo-card {
          display: flex;
          flex-direction: column;
        }
        .repo-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .repo-header h3 {
          margin-right: 1rem;
          font-size: 1.1rem;
          word-break: break-word;
        }
        .repo-header a {
          color: var(--color-primary);
          text-decoration: none;
        }
        .repo-header a:hover {
          text-decoration: underline;
        }
        .repo-visibility {
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 20px;
          color: #fff;
        }
        .private {
          background-color: var(--color-secondary);
        }
        .public {
          background-color: var(--color-success);
        }
        .repo-description {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: #57606a;
        }
        .repo-settings {
          margin-top: auto;
        }
        .settings-status {
          margin-bottom: 1rem;
        }
        .settings-status h4 {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .settings-status ul {
          list-style-type: none;
          font-size: 0.85rem;
        }
        .status-badge {
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.85rem;
          display: inline-block;
          margin-bottom: 0.8rem;
        }
        .status-configured {
          background-color: #dafbe1;
          color: var(--color-success);
        }
        .status-unconfigured {
          background-color: #ffebe9;
          color: var(--color-error);
        }
        .config-actions {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}
