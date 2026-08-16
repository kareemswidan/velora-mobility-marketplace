// Server-only locale access. Reading the cookie here means server components
// render in the right language on the first paint, with no client-side flash.
// Next 15 made cookies() asynchronous, so these are awaited by their callers.
import {cookies} from "next/headers";
import {LOCALE_COOKIE,normalizeLocale,translator,type Locale} from "@/lib/i18n";

export async function getLocale():Promise<Locale>{
  return normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value);
}

export async function getT(){
  return translator(await getLocale());
}

export async function isRtl(){
  return (await getLocale())==="ar";
}
