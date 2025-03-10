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
    <div className="card flex items-center gap-6 p-6 mb-8">
      <div>
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-20 h-20 rounded-full"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-xl font-semibold">{user.name || user.login}</h2>
        <p className="text-sm text-[#57606a]">@{user.login}</p>
      </div>
      <div>
        <a href="/auth/logout" className="btn">
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="card p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {repositories.length}
        </div>
        <div className="text-sm text-[#57606a]">Total Repositories</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {configuredCount}
        </div>
        <div className="text-sm text-[#57606a]">Configured</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {unconfiguredCount}
        </div>
        <div className="text-sm text-[#57606a]">Need Configuration</div>
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
    <div className="py-4">
      <Suspense
        fallback={
          <div className="p-8 text-center bg-[#f6f8fa] rounded-md border border-dashed border-border mb-6">
            Loading user profile...
          </div>
        }
      >
        <AsyncUserInfo userPromise={userPromise} />
      </Suspense>

      <Suspense
        fallback={
          <div className="p-8 text-center bg-[#f6f8fa] rounded-md border border-dashed border-border mb-6">
            Loading repository statistics...
          </div>
        }
      >
        <AsyncStats repositoriesPromise={repositoriesPromise} />
      </Suspense>

      <RepositoryList
        repositoryBatches={repositoryBatches}
        batchSize={batchSize}
      />
    </div>
  )
}
