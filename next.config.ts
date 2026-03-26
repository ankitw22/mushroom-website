import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stuff.thingsofbrand.com",
      },
      {
        protocol: "https",
        hostname: "**.thingsofbrand.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "**.viasocket.com",
      },
      {
        protocol: "https",
        hostname: "**.viasocket.com",
      },
    ],
  },
};

export default nextConfig;
