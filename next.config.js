/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@magic-sdk/admin'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Only exclude Magic admin SDK from client bundle
      config.externals = config.externals || []
      config.externals.push('@magic-sdk/admin')
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig