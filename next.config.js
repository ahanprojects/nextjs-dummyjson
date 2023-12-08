/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/products/new',
        destination: '/products/edit',
      },
      {
        source: '/products/:id/edit',
        destination: '/products/edit',
      },
    ];
  }
}

module.exports = nextConfig
