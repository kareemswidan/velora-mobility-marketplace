// Error strings returned by route handlers, in the caller's language.
// Route handlers run per-request, so reading the cookie here is safe.
import {cookies} from "next/headers";
import {LOCALE_COOKIE,normalizeLocale,translator,type Key} from "@/lib/i18n";

export async function et(key:Key):Promise<string>{
  return translator(normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value))(key);
}
