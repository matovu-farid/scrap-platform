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
import frontmatterPlugin from "remark-frontmatter";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
 
// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./app/env");
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,

  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [frontmatterPlugin],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
