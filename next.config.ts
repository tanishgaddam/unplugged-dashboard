import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/unplugged-dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
