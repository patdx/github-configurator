import { FC } from 'hono/jsx'

type MainLayoutProps = {
  children: any
  title?: string
}

export const MainLayout: FC<MainLayoutProps> = ({
  children,
  title = 'GitHub Configurator',
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body className="font-sans text-text bg-bg leading-normal">
        <div className="max-w-container-lg mx-auto px-4">
          <header className="flex justify-between items-center py-4 border-b border-border">
            <h1 className="text-2xl font-bold">GitHub Configurator</h1>
            <div className="nav">
              <a href="/" className="btn">
                Home
              </a>
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-6 mt-8 text-sm text-secondary border-t border-border">
            <div className="mb-4">
              <p className="mb-2">
                © {new Date().getFullYear()} GitHub Configurator
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/patdx/github-configurator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Source (GitHub)
                </a>
                <span>
                  by{' '}
                  <a
                    href="https://github.com/patdx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @patdx
                  </a>
                </span>
              </div>
            </div>

            <div className="text-xs mt-4 p-4 bg-[#f6f8fa] rounded-md border border-border">
              <p className="mb-2 font-medium text-warning">
                ⚠️ Warning: Experimental Tool
              </p>
              <p className="mb-2">
                This tool is highly experimental and designed primarily for the
                author's use only. Use at your own risk.
              </p>
              <p className="mb-2 font-medium text-info">
                🔒 Privacy Information
              </p>
              <p className="mb-3">
                We store your GitHub access tokens only as temporary cookies in
                your browser. These tokens are used just long enough to make
                requests to GitHub and are never stored in any database. All
                your data stays in your browser - we don't save anything on our
                servers.
              </p>
              <p>
                This tool is completely open source and only connects directly
                to GitHub's API using the temporary access you provide.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
