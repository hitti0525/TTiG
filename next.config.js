/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/rss.xml',
        destination: '/rss',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
