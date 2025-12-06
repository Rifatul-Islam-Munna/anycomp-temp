import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images:{
    remotePatterns: [
         {
        protocol: "https",
        hostname: "familyalbum-backend-for-post.6ybj83.easypanel.host",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
