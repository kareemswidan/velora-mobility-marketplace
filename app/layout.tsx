import type {Metadata,Viewport} from "next";
import {Amiri} from "next/font/google";
import "./globals.css";
import {Nav} from "@/components/Nav";
import {Chatbot} from "@/components/Chatbot";
import {I18nProvider} from "@/components/I18nProvider";

export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"),
  title:{default:"Velora Mobility",template:"%s · Velora"},
  description:"A global marketplace for energy, mobility and vehicle care.",
  applicationName:"Velora Mobility",
  manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/icon-192.png",sizes:"192x192",type:"image/png"},{url:"/icon-512.png",sizes:"512x512",type:"image/png"}]},
  openGraph:{title:"Velora Mobility",description:"Global energy and vehicle-care marketplace",type:"website",images:["/velora-hero.png"]}
};

// Amiri carries the Arabic side of the brand: a high-contrast naskh that stands next
// to the Latin Bodoni display instead of fighting it. next/font self-hosts the files,
// so nothing is fetched from Google at runtime.
const amiri=Amiri({subsets:["arabic"],weight:["400","700"],variable:"--font-arabic",display:"swap"});

export const viewport:Viewport={themeColor:"#06110d",colorScheme:"dark"};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="en" translate="no" className={`notranslate ${amiri.variable}`} suppressHydrationWarning>
    <body translate="no" suppressHydrationWarning>
      <I18nProvider>
        <Nav/>
        <main>{children}</main>
        <Chatbot/>
      </I18nProvider>
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-white/35 md:flex-row">
          <span>© {new Date().getFullYear()} Velora Mobility</span>
          <span>Global mobility · Available everywhere</span>
        </div>
      </footer>
    </body>
  </html>;
}
