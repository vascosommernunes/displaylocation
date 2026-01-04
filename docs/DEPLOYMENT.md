# Deployment guidance

The site is deployed via Cloudflare Pages using the standard Vite build (`npm run build`). If no deployment is triggered automatically after a commit, follow these steps:

1. Push the latest commit to the default branch (deployments only trigger for the tracked branch in Cloudflare).
2. Open Cloudflare Pages → choose the **displaylocation** project → **Deployments**.
3. Click **Trigger deployment** to start a new build from the latest commit, or use **Retry deployment** on the most recent run if it failed.
4. Watch the build logs to confirm the Vite build finishes successfully and that the site publishes.
5. If deployments remain paused, enable automatic deploys in the project settings or re-link the Git repository.

These steps ensure the hamburger menu change ships once the deployment pipeline runs.
