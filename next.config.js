/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    secret: process.env.SECRET,
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api" // development api
        : "https://app-shocase.herokuapp.com/api", // production api
  },
};

module.exports = nextConfig;
