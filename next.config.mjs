/** @type {import('next').NextConfig} */
const nextConfig={
  reactStrictMode:true,
  // Keep Next.js inside this repository even when a parent directory contains
  // another lockfile (common on Windows developer machines and CI workspaces).
  outputFileTracingRoot:process.cwd(),
  turbopack:{root:process.cwd()},
  // Let the Worker bundler handle the Prisma runtime and its WASM engine.
  serverExternalPackages:["@prisma/client","@prisma/adapter-d1"],
  // The engine-free Prisma client ships a WebAssembly query engine.
  webpack:(config)=>{
    config.experiments={...config.experiments,asyncWebAssembly:true};
    return config;
  },
  async headers(){return[{source:"/:path*",headers:[{key:"X-Content-Type-Options",value:"nosniff"},{key:"X-Frame-Options",value:"DENY"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},{key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(self)"},{key:"Cross-Origin-Opener-Policy",value:"same-origin"}]}]}
};
export default nextConfig;
