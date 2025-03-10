import { FC } from 'hono/jsx'

export const HomePage: FC = () => {
  return (
    <div className="py-8">
      <div className="card text-center p-8 mb-8 bg-[#f6f8fa]">
        <h2 className="text-xl font-semibold mb-4">
          GitHub Repository Settings Manager
        </h2>
        <p className="mb-6 text-lg">
          Configure your GitHub repositories with "squash merge only" settings
          in one place.
        </p>
        <div className="mt-6">
          <a href="/auth/github" className="btn">
            Login with GitHub
          </a>
        </div>
      </div>

      <div className="py-4">
        <h3 className="text-lg font-medium mb-4">Features</h3>
        <ul className="pl-6 list-disc">
          <li className="mb-2">
            Easily view and manage merge settings across all your repositories
          </li>
          <li className="mb-2">
            Apply "squash merge only" configuration with one click
          </li>
          <li className="mb-2">Bulk configure multiple repositories</li>
        </ul>
      </div>
    </div>
  )
}
