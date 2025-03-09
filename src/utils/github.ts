import { Octokit } from "octokit";
import { createTokenAuth } from "@octokit/auth-token";

// Create an authenticated Octokit client
export const createGitHubClient = (accessToken: string) => {
  return new Octokit({ auth: accessToken });
};

// Process repositories and return an array of batch promises
export const processRepositories = (
  repos: any[],
  octokit: Octokit,
  batchSize = 10,
): Promise<any[]>[] => {
  const batchCount = Math.ceil(repos.length / batchSize);
  const batchPromises: Promise<any[]>[] = [];

  // Create a separate promise for each batch
  for (let i = 0; i < batchCount; i++) {
    const startIndex = i * batchSize;
    const batchRepos = repos.slice(startIndex, startIndex + batchSize);

    // Create a promise that resolves to the processed repositories for this batch
    const batchPromise = new Promise<any[]>(async (resolve) => {
      // Small delay between batches to be kind to GitHub API
      if (i > 0) {
        await new Promise((r) => setTimeout(r, i * 300));
      }

      // Process each repository in the batch concurrently
      const processedRepos = await Promise.all(
        batchRepos.map(async (repo) => {
          try {
            // Get detailed repository information including merge settings
            const { data: detailedRepo } = await octokit.rest.repos.get({
              owner: repo.owner.login,
              repo: repo.name,
            });

            // Add calculated field for "squash merge only" configuration
            return {
              ...detailedRepo,
              is_squash_merge_only:
                detailedRepo.allow_squash_merge === true &&
                detailedRepo.allow_merge_commit === false &&
                detailedRepo.allow_rebase_merge === false,
            };
          } catch (error) {
            console.error(
              `Error fetching details for ${repo.full_name}:`,
              error,
            );
            // Return original repo with default values if detailed fetch fails
            return {
              ...repo,
              allow_squash_merge: false,
              allow_merge_commit: true,
              allow_rebase_merge: true,
              is_squash_merge_only: false,
            };
          }
        }),
      );

      resolve(processedRepos);
    });

    batchPromises.push(batchPromise);
  }

  return batchPromises;
};

// Fetch user details from GitHub
export const fetchUserDetails = async (accessToken: string) => {
  const octokit = createGitHubClient(accessToken);
  const { data: user } = await octokit.rest.users.getAuthenticated();
  return user;
};

// Fetch repositories for the authenticated user and return batched promises
export const fetchUserRepositories = async (
  accessToken: string,
  page = 1,
  perPage = 100,
  batchSize = 10,
): Promise<Promise<any[]>[]> => {
  const octokit = createGitHubClient(accessToken);

  try {
    // First, get the list of repositories
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: perPage,
      page: page,
    });

    // Return promises for batches of processed repositories
    return processRepositories(repos, octokit, batchSize);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
};

// For stats component, we still need to get all repositories in one go
export const fetchAllRepositories = async (
  accessToken: string,
  page = 1,
  perPage = 100,
): Promise<any[]> => {
  const octokit = createGitHubClient(accessToken);

  try {
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: perPage,
      page: page,
    });

    // Process all repositories in batches but return a single promise
    const batchPromises = processRepositories(repos, octokit);
    const results = await Promise.all(batchPromises);

    // Flatten the batches into a single array
    return results.flat();
  } catch (error) {
    console.error("Error fetching all repositories:", error);
    throw error;
  }
};

// Configure repository with "squash merge only" settings
export const configureRepository = async (
  accessToken: string,
  owner: string,
  repo: string,
) => {
  const octokit = createGitHubClient(accessToken);

  try {
    const { data } = await octokit.rest.repos.update({
      owner,
      repo,
      allow_squash_merge: true,
      allow_merge_commit: false,
      allow_rebase_merge: false,
    });

    return {
      ...data,
      is_squash_merge_only: true,
    };
  } catch (error) {
    console.error(`Error configuring repository ${owner}/${repo}:`, error);
    throw error;
  }
};

// Verify access token is valid
export const verifyAccessToken = async (accessToken: string) => {
  try {
    const auth = createTokenAuth(accessToken);
    const { token } = await auth();
    return !!token;
  } catch (error) {
    return false;
  }
};
