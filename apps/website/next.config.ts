import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lumo/ui", "@lumo/web", "@lumo/shared"],
  serverExternalPackages: ["zustand"],
};

export default nextConfig;
