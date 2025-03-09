import { FC } from "hono/jsx";

type MainLayoutProps = {
  children: any;
  title?: string;
};

export const MainLayout: FC<MainLayoutProps> = ({
  children,
  title = "GitHub Configurator",
}) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>{`
          :root {
            --color-primary: #0969da;
            --color-secondary: #30363d;
            --color-bg: #ffffff;
            --color-text: #24292f;
            --color-border: #d0d7de;
            --color-success: #2da44e;
            --color-error: #cf222e;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            color: var(--color-text);
            background-color: var(--color-bg);
            line-height: 1.5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--color-border);
            padding: 1rem 0;
          }
          .btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: var(--color-primary);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
          }
          .btn:hover {
            opacity: 0.9;
          }
          .card {
            border: 1px solid var(--color-border);
            border-radius: 6px;
            padding: 1rem;
            margin-bottom: 1rem;
          }
        `}</style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>GitHub Configurator</h1>
            <div class="nav">
              <a href="/" class="btn">
                Home
              </a>
            </div>
          </header>
          <main>{children}</main>
          <footer>
            <p>© {new Date().getFullYear()} GitHub Configurator</p>
          </footer>
        </div>
      </body>
    </html>
  );
};
