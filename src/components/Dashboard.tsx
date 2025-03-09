import { FC } from "hono/jsx";
import { Repository, RepositoryList } from "./RepositoryList";

type DashboardProps = {
  user: {
    login: string;
    avatar_url: string;
    name: string | null;
  };
  repositories: Repository[];
};

export const Dashboard: FC<DashboardProps> = ({ user, repositories }) => {
  const configuredCount = repositories.filter(
    (repo) => repo.is_squash_merge_only
  ).length;
  const unconfiguredCount = repositories.length - configuredCount;

  return (
    <div class="dashboard">
      <div class="user-info card">
        <div class="user-avatar">
          <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
        </div>
        <div class="user-details">
          <h2>{user.name || user.login}</h2>
          <p class="username">@{user.login}</p>
        </div>
        <div class="user-actions">
          <a href="/auth/logout" class="btn">
            Logout
          </a>
        </div>
      </div>

      <div class="stats-container">
        <div class="stat-card card">
          <div class="stat-value">{repositories.length}</div>
          <div class="stat-label">Total Repositories</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{configuredCount}</div>
          <div class="stat-label">Configured</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{unconfiguredCount}</div>
          <div class="stat-label">Need Configuration</div>
        </div>
      </div>

      <RepositoryList repositories={repositories} />

      <style>{`
        .dashboard {
          padding: 1rem 0;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .user-avatar img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .user-details {
          flex-grow: 1;
        }
        .username {
          color: #57606a;
          font-size: 0.9rem;
        }
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          padding: 1.5rem;
          text-align: center;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #57606a;
        }
      `}</style>
    </div>
  );
};
