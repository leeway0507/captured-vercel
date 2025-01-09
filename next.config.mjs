import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1r7wlqxs7xy7.cloudfront.net",
        port: "",
        pathname: "/cdn-images/**",
      },
    ],
  },
  output: "standalone",
  experimental:{
  serverComponentsExternalPackages: ['pino', 'pino-pretty']
}
};

export default withBundleAnalyzer(nextConfig)

