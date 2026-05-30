const isProd = process.env.NODE_ENV === 'production'
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'kotibajon-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: isGithubPages ? true : false,
  reactStrictMode: true,
  images: {
    unoptimized: isGithubPages ? true : false,
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    }
    return config
  },
}

module.exports = withPWA(nextConfig)
