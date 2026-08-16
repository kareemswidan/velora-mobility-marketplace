import type {Metadata,Viewport} from "next";
import "./globals.css";
import {Nav} from "@/components/Nav";
import {Chatbot} from "@/components/Chatbot";
import {I18nProvider} from "@/components/I18nProvider";
import {getLocale} from "@/lib/i18n-server";
import {translator} from "@/lib/i18n";

export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"),
  title:{default:"Velora Mobility",template:"%s · Velora"},
  description:"A global marketplace for energy, mobility and vehicle care.",
  applicationName:"Velora Mobility",
  manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/icon-192.png",sizes:"192x192",type:"image/png"},{url:"/icon-512.png",sizes:"512x512",type:"image/png"}]},
  openGraph:{title:"Velora Mobility",description:"Global energy and vehicle-care marketplace",type:"website",images:["/velora-hero.png"]}
};
export const viewport:Viewport={themeColor:"#06110d",colorScheme:"dark"};

export default async function Layout({children}:{children:React.ReactNode}){
  const locale=await getLocale();
  const rtl=locale==="ar";
  const t=translator(locale);
  return <html lang={locale} dir={rtl?"rtl":"ltr"} suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    </head>
    <body suppressHydrationWarning>
      <I18nProvider initialLocale={locale}>
        <Nav/>
        <main>{children}</main>
        <Chatbot/>
      </I18nProvider>
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-white/35 md:flex-row">
          <span>© {new Date().getFullYear()} Velora Mobility</span>
          <span>{t("brand_tagline")}</span>
        </div>
      </footer>
    </body>
  </html>;
}
