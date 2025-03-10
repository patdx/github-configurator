import { FC, Suspense } from 'hono/jsx'
import { Repository, RepositoryList } from './RepositoryList'

type User = {
  login: string
  avatar_url: string
  name: string | null
}

type DashboardProps = {
  userPromise: Promise<User>
  repositoriesPromise: Promise<Repository[]>
  repositoryBatches: Promise<Repository[]>[]
  batchSize?: number
}

// Async component for user info
const AsyncUserInfo: FC<{ userPromise: Promise<User> }> = async ({
  userPromise,
}) => {
  const user = await userPromise

  return (
    <div class="user-info card">
      <div class="user-avatar">
        <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
      </div>
      <div class="user-details">
        <h2>{user.name || user.login}</h2>
        <p class="username">@{user.login}</p>
      </div>
      <div class="user-actions">
        <a href="/auth/logout" class="btn">
          Logout
        </a>
      </div>
    </div>
  )
}

// Async component for repository stats
const AsyncStats: FC<{ repositoriesPromise: Promise<Repository[]> }> = async ({
  repositoriesPromise,
}) => {
  const repositories = await repositoriesPromise
  const configuredCount = repositories.filter(
    (repo) => repo.is_squash_merge_only,
  ).length
  const unconfiguredCount = repositories.length - configuredCount

  return (
    <div class="stats-container">
      <div class="stat-card card">
        <div class="stat-value">{repositories.length}</div>
        <div class="stat-label">Total Repositories</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{configuredCount}</div>
        <div class="stat-label">Configured</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{unconfiguredCount}</div>
        <div class="stat-label">Need Configuration</div>
      </div>
    </div>
  )
}

export const Dashboard: FC<DashboardProps> = ({
  userPromise,
  repositoriesPromise,
  repositoryBatches,
  batchSize = 10,
}) => {
  return (
    <div class="dashboard">
      <Suspense
        fallback={<div class="loading-indicator">Loading user profile...</div>}
      >
        <AsyncUserInfo userPromise={userPromise} />
      </Suspense>

      <Suspense
        fallback={
          <div class="loading-indicator">Loading repository statistics...</div>
        }
      >
        <AsyncStats repositoriesPromise={repositoriesPromise} />
      </Suspense>

      <RepositoryList
        repositoryBatches={repositoryBatches}
        batchSize={batchSize}
      />

      <style>{`
        .dashboard {
          padding: 1rem 0;
        }
        .loading-indicator {
          padding: 2rem;
          text-align: center;
          background-color: #f6f8fa;
          border-radius: 6px;
          border: 1px dashed var(--color-border);
          margin-bottom: 1.5rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .user-avatar img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .user-details {
          flex-grow: 1;
        }
        .username {
          color: #57606a;
          font-size: 0.9rem;
        }
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          padding: 1.5rem;
          text-align: center;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #57606a;
        }
      `}</style>
    </div>
  )
}
