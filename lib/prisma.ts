import {PrismaClient} from "@/lib/generated/prisma/client";
import {PrismaD1} from "@prisma/adapter-d1";
import {getCloudflareContext} from "@opennextjs/cloudflare";

/**
 * Prisma 6 generates an engine-free client, so every environment needs a
 * driver adapter. On Cloudflare the D1 handle only exists inside a request
 * context, which is why the client is resolved lazily through a proxy: every
 * existing `prisma.model.query()` call site stays unchanged.
 */
type D1 = ConstructorParameters<typeof PrismaD1>[0];
const g = globalThis as unknown as {__prismaD1?: PrismaClient};

function resolve(): PrismaClient {
  const env = getCloudflareContext().env as unknown as {DB?: D1};
  if (!env?.DB) throw new Error("D1 binding `DB` is missing from the Worker environment");
  if (!g.__prismaD1) g.__prismaD1 = new PrismaClient({adapter: new PrismaD1(env.DB)});
  return g.__prismaD1;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const c = resolve() as unknown as Record<string | symbol, unknown>;
    const v = c[prop];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(c) : v;
  },
});
