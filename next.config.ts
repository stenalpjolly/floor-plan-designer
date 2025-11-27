import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: isGithubActions ? 'export' : undefined,
  basePath: isGithubActions ? '/floor-plan-designer' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
