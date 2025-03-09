import { FC } from "hono/jsx";

export const HomePage: FC = () => {
  return (
    <div class="home-page">
      <div class="hero card">
        <h2>GitHub Repository Settings Manager</h2>
        <p>
          Configure your GitHub repositories with "squash merge only" settings
          in one place.
        </p>
        <div class="cta-container">
          <a href="/auth/github" class="btn">
            Login with GitHub
          </a>
        </div>
      </div>

      <div class="features">
        <h3>Features</h3>
        <ul>
          <li>
            Easily view and manage merge settings across all your repositories
          </li>
          <li>Apply "squash merge only" configuration with one click</li>
          <li>Bulk configure multiple repositories</li>
        </ul>
      </div>

      <style>{`
        .home-page {
          padding: 2rem 0;
        }
        .hero {
          text-align: center;
          padding: 2rem;
          margin-bottom: 2rem;
          background-color: #f6f8fa;
        }
        .hero h2 {
          margin-bottom: 1rem;
        }
        .hero p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .cta-container {
          margin-top: 1.5rem;
        }
        .features {
          padding: 1rem 0;
        }
        .features h3 {
          margin-bottom: 1rem;
        }
        .features ul {
          padding-left: 1.5rem;
        }
        .features li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};
