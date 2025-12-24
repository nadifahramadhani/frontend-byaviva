import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // Port Backend NestJS
        pathname: "/uploads/**", // Izinkan akses ke semua file di dalam folder uploads
      },
    ],
  },
};

export default nextConfig;
