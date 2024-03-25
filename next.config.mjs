/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: false,
  publicRuntimeConfig: {
    api: {
      bodyParser: false,
    },
  },
};

export default nextConfig;
