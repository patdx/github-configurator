import { FC } from 'hono/jsx'
import styles from '../styles.css?url'

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
        <link href={styles} rel="stylesheet" />
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
          <footer className="py-4 mt-8 text-sm text-secondary">
            <p>© {new Date().getFullYear()} GitHub Configurator</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
