/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "api.qrserver.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
