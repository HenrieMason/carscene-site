import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dream6",
        destination: "https://dream3.carsceneapparel.com",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;