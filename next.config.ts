import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dream9",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;