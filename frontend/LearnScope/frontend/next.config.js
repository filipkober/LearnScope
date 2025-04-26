/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase the build timeout to accommodate larger pages
  experimental: {
    buildTimeout: 120 // 2 minutes in seconds
  },
  // Enable static optimization where possible
  staticPageGenerationTimeout: 120,
  // Other recommended settings
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig

