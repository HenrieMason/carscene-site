import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "dream3.carsceneapparel.com",
          },
        ],
        destination: "/dream3",
      },
    ];
  },
};

export default nextConfig;