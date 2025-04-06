import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/run/:id",
        destination: "http://127.0.0.1:5000/run/:id",
      },
      {
        source: "/get_problem/:id",
        destination: "http://127.0.0.1:5000/get_problem/:id",
      },
    ];
  },
};

export default nextConfig;
