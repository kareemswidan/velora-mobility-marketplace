"use client";

import {createContext,useContext,useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {LOCALE_COOKIE,normalizeLocale,translator,type Key,type Locale} from "@/lib/i18n";

function readCookie():Locale{
  if(typeof document==="undefined")return "en";
  const hit=document.cookie.split("; ").find(c=>c.startsWith(`${LOCALE_COOKIE}=`));
  return normalizeLocale(hit?.split("=")[1]);
}

const I18nContext=createContext<{locale:Locale;setLocale:(l:Locale)=>void;t:(k:Key)=>string}>({
  locale:"en",setLocale:()=>{},t:translator("en")
});

export function I18nProvider({initialLocale="en",children}:{initialLocale?:Locale;children:React.ReactNode}){
  const router=useRouter();
  const[locale,setValue]=useState<Locale>(initialLocale);

  // a stale cookie from a previous visit wins over the server default
  useEffect(()=>{const c=readCookie();if(c!==locale)setValue(c)},[]);

  useEffect(()=>{
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
  },[locale]);

  function setLocale(value:Locale){
    // one year, root path, so server components read the same value
    document.cookie=`${LOCALE_COOKIE}=${value};path=/;max-age=31536000;samesite=lax`;
    setValue(value);
    router.refresh(); // re-render the server components in the new language
  }

  return <I18nContext.Provider value={{locale,setLocale,t:translator(locale)}}>{children}</I18nContext.Provider>;
}

export const useI18n=()=>useContext(I18nContext);
