import { Octokit } from "octokit";
import { createTokenAuth } from "@octokit/auth-token";

// Create an authenticated Octokit client
export const createGitHubClient = (accessToken: string) => {
  return new Octokit({ auth: accessToken });
};

// Enhance repository data with calculated fields
// This is now an async function since it needs to fetch additional data
export const processRepositories = async (
  repos: any[],
  octokit: Octokit
): Promise<any[]> => {
  // Process repositories in batches to avoid rate limiting
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize);

    // Process each batch concurrently
    const batchPromises = batch.map(async (repo) => {
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
        console.error(`Error fetching details for ${repo.full_name}:`, error);
        // Return original repo with default values if detailed fetch fails
        return {
          ...repo,
          allow_squash_merge: false,
          allow_merge_commit: true,
          allow_rebase_merge: true,
          is_squash_merge_only: false,
        };
      }
    });

    // Wait for all repositories in this batch to process
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add a small delay between batches to be kind to GitHub API
    if (i + batchSize < repos.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
};

// Fetch user details from GitHub
export const fetchUserDetails = async (accessToken: string) => {
  const octokit = createGitHubClient(accessToken);
  const { data: user } = await octokit.rest.users.getAuthenticated();
  return user;
};

// Fetch repositories for the authenticated user
export const fetchUserRepositories = async (
  accessToken: string,
  page = 1,
  perPage = 100
) => {
  const octokit = createGitHubClient(accessToken);

  try {
    // First, get the list of repositories
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: perPage,
      page: page,
    });

    // Then process them to add detailed information
    return await processRepositories(repos, octokit);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
};

// Configure repository with "squash merge only" settings
export const configureRepository = async (
  accessToken: string,
  owner: string,
  repo: string
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
