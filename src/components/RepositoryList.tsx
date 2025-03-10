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
    <div className="card flex flex-col" key={repo.id}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="mr-4 text-lg break-words">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary no-underline hover:underline"
          >
            {repo.full_name}
          </a>
        </h3>
        <span
          className={`text-xs py-1 px-2 rounded-full text-white ${
            repo.private ? 'bg-secondary' : 'bg-success'
          }`}
        >
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>

      {repo.description && (
        <p className="text-sm mb-4 text-[#57606a]">{repo.description}</p>
      )}

      <div className="mt-auto">
        <div className="mb-4">
          <h4 className="text-sm mb-2 font-medium">Merge Settings:</h4>
          <ul className="text-xs list-none">
            <li>Squash merges: {repo.allow_squash_merge ? '✅' : '❌'}</li>
            <li>Merge commits: {repo.allow_merge_commit ? '✅' : '❌'}</li>
            <li>Rebase merges: {repo.allow_rebase_merge ? '✅' : '❌'}</li>
          </ul>
        </div>

        <div>
          {repo.is_squash_merge_only ? (
            <div className="inline-block py-1 px-3 rounded text-sm mb-3 bg-[#dafbe1] text-success">
              ✓ Configured for squash merges only
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="inline-block py-1 px-3 rounded text-sm mb-3 bg-[#ffebe9] text-error">
                Not configured for squash merges only
              </div>
              <form
                action={`/api/repos/${repo.owner.login}/${repo.name}/configure`}
                method="post"
              >
                <button type="submit" className="btn">
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
    <div className="contents" data-batch={batchIndex}>
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
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-6">Your Repositories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositoryBatches.length > 0 ? (
          repositoryBatches.map((batch, index) => (
            <Suspense
              fallback={
                <div className="p-8 text-center bg-[#f6f8fa] rounded-md border border-dashed border-border mb-4">
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
    </div>
  )
}
