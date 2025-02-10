// const withMDX = require("@next/mdx")()

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = withMDX(nextConfig)
// import createMDX from '@next/mdx'
import createMDX from "@next/mdx";
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  swcMinify: true,
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
