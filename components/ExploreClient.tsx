"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {Clock3,Crosshair,ExternalLink,MapPin,Navigation,Search} from "lucide-react";

type Place={id:string;name:string;address:string;city:string;country:string;latitude:number;longitude:number;phone:string;openingTime:string;closingTime:string;business:{type:string;name:string;services:{name:string;price:string}[]}|null};
const distance=(a:number,b:number,c:number,d:number)=>{const r=6371,p=(x:number)=>x*Math.PI/180,x=p(c-a),y=p(d-b),q=Math.sin(x/2)**2+Math.cos(p(a))*Math.cos(p(c))*Math.sin(y/2)**2;return 2*r*Math.asin(Math.sqrt(q))};

export function ExploreClient({places}:{places:Place[]}){
  const[query,setQuery]=useState("");
  const[type,setType]=useState("ALL");
  const[position,setPosition]=useState<{lat:number;lng:number}|null>(null);
  const[selected,setSelected]=useState(places[0]?.id||"");
  const shown=useMemo(()=>places.filter(x=>(type==="ALL"||x.business?.type===type)&&`${x.name} ${x.city} ${x.country} ${x.business?.name||""}`.toLowerCase().includes(query.toLowerCase())).map(x=>({...x,distance:position?distance(position.lat,position.lng,x.latitude,x.longitude):null})).sort((a,b)=>(a.distance??99999)-(b.distance??99999)),[places,query,type,position]);
  const focus=shown.find(x=>x.id===selected)||shown[0];
  function locate(){navigator.geolocation?.getCurrentPosition(x=>setPosition({lat:x.coords.latitude,lng:x.coords.longitude}),()=>alert("Location access was not available."))}
  return <>
    <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto_auto]">
      <label className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} className="field pl-11" placeholder="Search city, country or business"/></label>
      <select className="field md:w-52" value={type} onChange={e=>setType(e.target.value)}><option value="ALL">All businesses</option><option value="GAS_STATION">Gas stations</option><option value="CAR_WASH">Car washes</option><option value="SERVICE_CENTER">Service centers</option></select>
      <button onClick={locate} className="btn btn-gold"><Crosshair className="h-4 w-4"/>Near me</button>
    </div>
    <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
        {shown.map(s=><article key={s.id} className={`w-full rounded-3xl border p-6 text-left transition ${focus?.id===s.id?"border-gold/50 bg-gold/10":"border-white/10 bg-white/[.04] hover:bg-white/[.07]"}`}>
          <button onClick={()=>setSelected(s.id)} className="w-full text-left">
            <div className="flex justify-between"><div><span className="eyebrow">{s.business?.type.replaceAll("_"," ")||"Mobility hub"}</span><h2 className="mt-2 font-serif text-2xl">{s.name}</h2><p className="mt-2 text-sm text-white/40">{s.address}, {s.city}, {s.country}</p></div><MapPin className="text-gold"/></div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/50"><span className="rounded-full bg-white/5 px-3 py-2"><Clock3 className="mr-1 inline h-3 w-3"/>{s.openingTime}–{s.closingTime}</span>{s.distance!==null&&<span className="rounded-full bg-white/5 px-3 py-2">{s.distance.toFixed(1)} km away</span>}</div>
          </button>
          <Link href={`/stations/${s.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold">View location details <ExternalLink className="h-4 w-4"/></Link>
        </article>)}
        {!shown.length&&<div className="glass rounded-3xl p-10 text-center text-white/40">No matching locations.</div>}
      </div>
      <div className="glass sticky top-24 min-h-[620px] overflow-hidden rounded-[2rem]">{focus&&<><iframe title={`Map of ${focus.name}`} className="h-[620px] w-full border-0 grayscale-[.25] invert-[.88] hue-rotate-[105deg]" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${focus.longitude-.035}%2C${focus.latitude-.025}%2C${focus.longitude+.035}%2C${focus.latitude+.025}&layer=mapnik&marker=${focus.latitude}%2C${focus.longitude}`}/><div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-ink/90 p-5 backdrop-blur"><div><b>{focus.name}</b><p className="text-xs text-white/40">{focus.city}, {focus.country}</p></div><a className="btn btn-gold py-2 text-xs" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?mlat=${focus.latitude}&mlon=${focus.longitude}#map=16/${focus.latitude}/${focus.longitude}`}>Directions<Navigation className="h-4 w-4"/></a></div></>}</div>
    </div>
  </>;
}
