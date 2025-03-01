/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // experimental: {
  //   runtime: "experimental-edge", // Ensures Netlify uses Edge Functions for middleware
  // },
};

module.exports = nextConfig;
