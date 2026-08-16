/** @type {import('next').NextConfig} */
const nextConfig={
  reactStrictMode:true,
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
