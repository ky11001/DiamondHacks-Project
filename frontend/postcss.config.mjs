const config = {
  plugins: ["@tailwindcss/postcss"],
};

module.exports = {
  async headers() {
    return [
      {
        source: "/vibecheckLogo.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache for 1 year
          },
        ],
      },
    ];
  },
};


export default config;
