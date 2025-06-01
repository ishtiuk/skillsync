/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pathways-user-data-staging.s3.amazonaws.com',
        pathname: '/**' // Allows all images from this domain
      }
    ]
  }
};

export default nextConfig;
