import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      },
    ];
    return config;
  },
};

export default nextConfig;
