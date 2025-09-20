/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // enables `next export`
  distDir: "out",   // export into /out folder (matches main.js)
  trailingSlash: true // safer for file:// paths
};

export default nextConfig;
