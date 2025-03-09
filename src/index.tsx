import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono();

// Set up JSX renderer middleware
app.get(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>GitHub Configurator</title>
        </head>
        <body>
          <div class="container">{children}</div>
        </body>
      </html>
    );
  })
);

app.get("/", (c) => {
  return c.render(
    <div>
      <h1>GitHub Repository Configurator</h1>
      <p>Configure your GitHub repositories with ease</p>
    </div>
  );
});

export default app;
