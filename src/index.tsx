import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getCookie, setCookie } from "hono/cookie";
import { githubAuth } from "@hono/oauth-providers/github";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";
import { Repository } from "./components/RepositoryList";
import {
  fetchUserRepositories,
  fetchUserDetails,
  configureRepository,
  fetchAllRepositories,
} from "./utils/github";
import {
  setSessionToken,
  getSessionToken,
  clearSessionToken,
  authMiddleware,
  isAuthenticated,
} from "./utils/auth";
import { contextStorage, getContext } from "hono/context-storage";
import { HTTPException } from "hono/http-exception";

type Env = {
  GITHUB_ID: string;
  GITHUB_SECRET: string;
};

// Create the Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((error, c) => {
  console.error("Error:", error);
  return c.json({ error: "An error occurred" }, 500);
});

app.use(contextStorage());

// Set up JSX renderer middleware
app.get(
  "*",
  jsxRenderer(
    ({ children }) => {
      return <MainLayout>{children}</MainLayout>;
    },
    {
      stream: true,
    },
  ),
);

// Home route - show login or redirect to dashboard if authenticated
app.get("/", async (c) => {
  const authenticated = await isAuthenticated(c);

  if (authenticated) {
    return c.redirect("/dashboard");
  }

  return c.render(<HomePage />);
});

// Auth routes
app.use(
  "/auth/github",
  githubAuth({
    // client_id: c.env.GITHUB_ID,
    // client_secret: c.env.GITHUB_SECRET,
    // scope: ["read:user", "repo"],
    // callback: async (code, state, ctx) => {
    //   // Use the provided token info
    //   const { accessToken } = ctx.tokenInfo;
    //   // Store the token in a secure cookie
    //   setSessionToken(ctx, accessToken);
    //   // Redirect to dashboard
    //   return ctx.redirect("/dashboard");
    // },
  }),
);

app.get("/auth/github", async (c, next) => {
  // if we are here, the req should contain either a valid session or a valid auth code
  const session = getSessionToken(c);
  const token = c.get("token");
  console.log(`Session: ${session}, Token: ${token}`);
  if (token) {
    setSessionToken(c, token.token);
    return c.redirect("/dashboard");
  } else if (!session) {
    throw new HTTPException(401);
  }
  return next();
});

// Logout route
app.get("/auth/logout", (c) => {
  clearSessionToken(c);
  return c.redirect("/");
});

// Dashboard route (protected)
app.get("/dashboard", authMiddleware, async (c) => {
  const accessToken = getSessionToken(c);

  if (!accessToken) {
    return c.redirect("/");
  }

  try {
    const batchSize = 10;

    // Create promises for user details and repository batches
    const userPromise = fetchUserDetails(accessToken);

    // Get batched repository promises - each batch will resolve independently
    const repositoryBatches = await fetchUserRepositories(
      accessToken,
      1,
      100,
      batchSize,
    );

    // Create a single promise that aggregates all repositories for stats
    const repositoriesPromise = fetchAllRepositories(accessToken);

    // Pass both the individual batch promises and the aggregated promise to the Dashboard
    return c.render(
      <Dashboard
        userPromise={userPromise}
        repositoriesPromise={repositoriesPromise}
        repositoryBatches={repositoryBatches}
        batchSize={batchSize}
      />,
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    // If there's an error, clear the session and redirect to home
    clearSessionToken(c);
    return c.redirect("/?error=session_error");
  }
});

// API endpoints
const api = new Hono();

// Configure repository endpoint
api.post("/repos/:owner/:repo/configure", authMiddleware, async (c) => {
  const { owner, repo } = c.req.param();
  const accessToken = getSessionToken(c);

  if (!accessToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const updatedRepo = await configureRepository(accessToken, owner, repo);
    // Redirect to dashboard instead of returning JSON
    return c.redirect(
      "/dashboard?configured=" + encodeURIComponent(`${owner}/${repo}`),
    );
  } catch (error) {
    console.error(`Error configuring repo ${owner}/${repo}:`, error);
    // Redirect to dashboard with error message
    return c.redirect(
      `/dashboard?error=config_failed&repo=${encodeURIComponent(
        `${owner}/${repo}`,
      )}`,
    );
  }
});

// Mount the API router
app.route("/api", api);

// Export the app
export default app;
