"use client";

import {createContext,useContext,useEffect,useState} from "react";

type Locale="en"|"ar";
type Dictionary={home:string;explore:string;book:string;store:string;business:string;signin:string;language:string};

const words:Record<Locale,Dictionary>={
  en:{home:"Home",explore:"Explore",book:"Book",store:"E-Mart",business:"For business",signin:"Sign in",language:"العربية"},
  ar:{home:"الرئيسية",explore:"استكشف",book:"احجز",store:"المتجر",business:"للأعمال",signin:"دخول",language:"English"}
};

const I18nContext=createContext({locale:"en" as Locale,setLocale:(_:Locale)=>{},t:(key:keyof Dictionary)=>words.en[key]});

export function I18nProvider({children}:{children:React.ReactNode}){
  const[locale,setValue]=useState<Locale>("en");
  useEffect(()=>{if(localStorage.getItem("velora_locale")==="ar")setValue("ar")},[]);
  useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr"},[locale]);
  function setLocale(value:Locale){localStorage.setItem("velora_locale",value);setValue(value)}
  return <I18nContext.Provider value={{locale,setLocale,t:key=>words[locale][key]}}>{children}</I18nContext.Provider>;
}

export const useI18n=()=>useContext(I18nContext);
