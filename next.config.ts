import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Foto de perfil pode ter até 5 MB; 6 MB dá folga p/ overhead do form.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
