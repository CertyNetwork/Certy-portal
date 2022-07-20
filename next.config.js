/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
  },
  env: {
    NETWORK_ID: process.env.NETWORK_ID,
    CONTRACT_NAME: process.env.CONTRACT_NAME,
    NEAR_NODE_URL: process.env.NEAR_NODE_URL,
    WALLET_URL: process.env.WALLET_URL,
    HELPER_URL: process.env.HELPER_URL,
    EXPLORER_URL: process.env.EXPLORER_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    SUB_GRAPH: process.env.SUB_GRAPH,
    VOUCHED_PUBLIC_KEY: process.env.VOUCHED_PUBLIC_KEY,
    VOUCHED_SANDBOX_MODE: process.env.VOUCHED_SANDBOX_MODE,
  }
}

module.exports = nextConfig
