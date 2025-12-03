import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  // Esto asegura que no haya prerendering
  generateBuildId: async () => {
    return 'build'
  },
}

export default nextConfig
