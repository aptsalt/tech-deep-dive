import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/tech-deep-dive" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
