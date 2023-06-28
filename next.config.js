/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol : 'https',
        hostname : 'drive.google.com',
        port     : '',
        pathname : '**',
      },
      {
        protocol : 'https',
        hostname : '**.googleusercontent.com',
        port     : '',
        pathname : '**',
      },
    ],
  },
  
  reactStrictMode: true,
  // swcMinify: false,
  
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      ...{topLevelAwait: true}
    }
    return config
  },
}


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: true,
// });
// module.exports = withBundleAnalyzer(nextConfig);

module.exports = nextConfig;
