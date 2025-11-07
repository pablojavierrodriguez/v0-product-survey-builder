/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.infrastructureLogging = {
      level: 'error',
    }
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      /lightBlue/,
      /warmGray/,
      /trueGray/,
      /coolGray/,
      /blueGray/,
    ]
    
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...(process.env.VERCEL_ENV === "production"
            ? [
                // 🔒 Producción (main): bloquear iframes
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Content-Security-Policy", value: "frame-src 'none';" },
              ]
            : [
                // 🛠️ Preview y Dev: permitir Google + Vercel Live
                { key: "Content-Security-Policy", value: "frame-src 'self' https://accounts.google.com https://vercel.live;" },
              ]),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
