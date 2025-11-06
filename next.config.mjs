/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment below to use proxy instead of direct API calls
  /*
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://task-tracker.test/api/:path*',
      },
    ];
  },
  */
};

export default nextConfig;
