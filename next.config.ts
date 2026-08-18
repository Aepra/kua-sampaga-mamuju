import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local development origins including VirtualBox/LAN IPs
  allowedDevOrigins: [
    "192.168.56.1",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
