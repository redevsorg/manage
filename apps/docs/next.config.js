/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['outstatic'],
  basePath: '/docs',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/introduction',
        permanent: true,
        basePath: false
      }
    ]
  }
}

module.exports = nextConfig
