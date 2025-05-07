import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Suppress all ESLint errors/warnings during builds
  },  
};

export default nextConfig;
