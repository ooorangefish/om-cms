/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/singers",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
