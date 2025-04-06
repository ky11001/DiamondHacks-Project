import type { NextConfig } from "next";

const API_BASE_URL = "https://diamondhacks-project.onrender.com";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/run/:id",
        destination: `${API_BASE_URL}/run/:id`,
      },
      {
        source: "/get_problem/:id",
        destination: `${API_BASE_URL}/get_problem/:id`,
      },
      {
        source: "/list_problems",
        destination: `${API_BASE_URL}/list_problems`,
      },
      {
        source: "/chat",
        destination: `${API_BASE_URL}/chat`,
      },
      {
        source: "/chat/reset",
        destination: `${API_BASE_URL}/chat/reset`,
      },
    ];
  },
};

export default nextConfig;
