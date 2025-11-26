import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/floor-plan-designer',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
