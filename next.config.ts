import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-1d125fe406c2413c836fec3139f85cbd.r2.dev",
            },
        ],
    },
};

module.exports = nextConfig;
