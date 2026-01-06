import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer, webpack }) => {
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }
    
    // Replace WalletConnect and Solana imports with stub modules
    // Using NormalModuleReplacementPlugin to replace imports at module resolution time
    const stubPath = path.resolve(__dirname, 'stubs')
    
    config.plugins = config.plugins || []
    
    // Replace WalletConnect packages with stubs
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@walletconnect\/ethereum-provider$/,
        path.resolve(stubPath, '@walletconnect', 'ethereum-provider.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@walletconnect\/core$/,
        path.resolve(stubPath, '@walletconnect', 'core.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@walletconnect\/universal-provider$/,
        path.resolve(stubPath, '@walletconnect', 'universal-provider.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@walletconnect\/sign-client$/,
        path.resolve(stubPath, '@walletconnect', 'sign-client.js')
      ),
      // Replace Solana packages with stubs
      new webpack.NormalModuleReplacementPlugin(
        /^@solana\/web3\.js$/,
        path.resolve(stubPath, '@solana', 'web3.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@solana-program\/system$/,
        path.resolve(stubPath, '@solana-program', 'system.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@solana-program\/token$/,
        path.resolve(stubPath, '@solana-program', 'token.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@solana\/kit$/,
        path.resolve(stubPath, '@solana', 'kit.js')
      ),
    )
    
    // Also add resolve aliases as a backup
    config.resolve.alias = {
      ...config.resolve.alias,
      '@walletconnect/ethereum-provider': path.resolve(stubPath, '@walletconnect', 'ethereum-provider.js'),
      '@walletconnect/core': path.resolve(stubPath, '@walletconnect', 'core.js'),
      '@walletconnect/universal-provider': path.resolve(stubPath, '@walletconnect', 'universal-provider.js'),
      '@walletconnect/sign-client': path.resolve(stubPath, '@walletconnect', 'sign-client.js'),
      '@solana/web3.js': path.resolve(stubPath, '@solana', 'web3.js'),
      '@solana-program/system': path.resolve(stubPath, '@solana-program', 'system.js'),
      '@solana-program/token': path.resolve(stubPath, '@solana-program', 'token.js'),
      '@solana/kit': path.resolve(stubPath, '@solana', 'kit.js'),
    }
    
    // Ignore Solana and wallet packages on server side
    if (isServer) {
      const originalExternals = config.externals
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals].filter(Boolean)),
        ({ request }, callback) => {
          if (
            request?.startsWith('@solana') ||
            request?.startsWith('@solana-program') ||
            request?.startsWith('@solana/kit') ||
            request?.startsWith('@walletconnect')
          ) {
            // Return empty module instead of trying to require it
            return callback(null, '{}')
          }
          callback()
        },
      ]
    }
    
    return config
  },
  // Note: serverExternalPackages doesn't support regex, so we handle it in webpack config
  // But we can list common ones here as a fallback
  serverExternalPackages: [
    '@solana/web3.js',
    '@solana-program/system',
    '@solana-program/token',
    '@solana/kit',
    '@walletconnect/ethereum-provider',
    '@walletconnect/core',
    '@walletconnect/universal-provider',
    '@walletconnect/sign-client',
  ],
}

export default nextConfig
