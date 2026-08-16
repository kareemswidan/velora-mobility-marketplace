"use client";

import {useI18n} from "@/components/I18nProvider";import {intlLocale} from "@/lib/i18n";import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Bell,Car,CheckCheck,Heart,Loader2,Package,Plus,X} from "lucide-react";
import {dateTime,money} from "@/lib/format";

export function AccountDashboard({user}:{user:any}){const{t,locale}=useI18n();
  const router=useRouter();
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState("");
  async function cancel(id:string){if(!confirm("Cancel this reservation?"))return;const response=await fetch("/api/account/bookings",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});if(response.ok)router.refresh()}
  async function addVehicle(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;setBusy(true);setMessage("");const response=await fetch("/api/account/vehicles",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const data=await response.json();setBusy(false);if(response.ok){form.reset();router.refresh()}else setMessage(data.error||"Could not save vehicle")}
  async function removeVehicle(id:string){if(!confirm("Remove this vehicle?"))return;await fetch("/api/account/vehicles",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});router.refresh()}
  async function markRead(){await fetch("/api/account/notifications",{method:"PATCH"});router.refresh()}
  return <div className="mt-10 grid gap-5 lg:grid-cols-3">
    <div className="space-y-5 lg:col-span-2">
      <section className="glass rounded-2xl p-6">
        <div className="flex justify-between"><h2 className="font-serif text-2xl">{t("account_reservations")}</h2><Link href="/booking" className="text-sm text-gold">{t("account_new_booking")}</Link></div>
        <div className="mt-5 space-y-3">{user.bookings.length?user.bookings.map((booking:any)=><div key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/5 p-4"><div><b>{booking.station.name}</b><p className="mt-1 text-xs text-white/35">{dateTime(booking.scheduledAt,intlLocale(locale),booking.station.timezone)} · {booking.service.replaceAll("_"," ")}</p></div><div className="flex items-center gap-3"><span className="text-xs text-gold">{booking.status}</span>{!["COMPLETED","CANCELLED"].includes(booking.status)&&<button onClick={()=>cancel(booking.id)} className="grid h-8 w-8 place-items-center rounded-full bg-red-400/10 text-red-300" title={t("cancel")}><X className="h-4 w-4"/></button>}</div></div>):<p className="text-white/35">{t("account_no_reservations")}</p>}</div>
      </section>
      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3"><Car className="text-gold"/><h2 className="font-serif text-2xl">{t("account_garage")}</h2></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{user.vehicles.map((vehicle:any)=><div key={vehicle.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4"><div><b>{vehicle.name}</b><p className="text-xs text-white/40">{vehicle.make} {vehicle.model}{vehicle.plate?` · ${vehicle.plate}`:""}</p></div><button onClick={()=>removeVehicle(vehicle.id)} className="text-white/35 hover:text-red-300" aria-label={`Remove ${vehicle.name}`}><X className="h-4 w-4"/></button></div>)}</div>
        <form onSubmit={addVehicle} className="mt-5 grid gap-3 sm:grid-cols-2"><input className="field" name="name" placeholder={t("account_vehicle_nickname")} required/><input className="field" name="make" placeholder={t("account_make")} required/><input className="field" name="model" placeholder={t("account_model")} required/><input className="field" name="plate" placeholder={t("booking_plate")}/><button disabled={busy} className="btn btn-gold sm:col-span-2">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>}Add vehicle</button>{message&&<p className="text-sm text-red-300 sm:col-span-2">{message}</p>}</form>
      </section>
    </div>
    <aside className="space-y-5">
      <div className="glass rounded-2xl p-6"><div className="flex items-start justify-between"><div><Bell className="text-gold"/><h2 className="mt-4 font-serif text-2xl">{t("account_notifications")}</h2></div>{user.notifications.some((item:any)=>!item.read)&&<button onClick={markRead} className="text-gold" title={t("account_mark_read")}><CheckCheck className="h-5 w-5"/></button>}</div><div className="mt-4 space-y-3">{user.notifications.map((item:any)=><div key={item.id} className={`border-b border-white/5 pb-3 ${item.read?"opacity-50":""}`}><b className="text-sm">{t(item.title as never)}</b><p className="mt-1 text-xs text-white/35">{item.message}</p></div>)}{!user.notifications.length&&<p className="text-sm text-white/35">{t("account_caught_up")}</p>}</div></div>
      <div className="glass rounded-2xl p-6"><Package className="text-gold"/><h2 className="mt-4 font-serif text-2xl">{t("account_orders")}</h2>{user.orders.map((order:any)=><p key={order.id} className="mt-3 flex justify-between text-sm"><span>#{order.id.slice(-7)}</span><span className="text-gold">{money(order.total,undefined,intlLocale(locale))}</span></p>)}{!user.orders.length&&<p className="mt-3 text-sm text-white/35">{t("account_no_orders")}</p>}</div>
      <div className="glass rounded-2xl p-6"><Heart className="text-gold"/><h2 className="mt-4 font-serif text-2xl">{t("account_favorites")}</h2>{user.favorites.map((favorite:any)=><p key={favorite.id} className="mt-2 text-sm">{favorite.station.name}</p>)}{!user.favorites.length&&<p className="mt-3 text-sm text-white/35">{t("account_save_from_explore")}</p>}</div>
    </aside>
  </div>;
}
