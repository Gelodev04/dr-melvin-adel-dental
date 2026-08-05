/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Include seeded SQLite so serverless can copy it to /tmp
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db"],
  },
};

module.exports = nextConfig;
