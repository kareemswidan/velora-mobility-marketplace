"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {LockKeyhole,Loader2,ShieldCheck,Store,UserRound} from "lucide-react";

const demos=[
  {label:"Customer",email:"customer@velora.demo",password:"CustomerDemo2026!",icon:UserRound},
  {label:"Business",email:"owner@velora.demo",password:"OwnerDemo2026!",icon:Store},
  {label:"Admin",email:"admin@velora.energy",password:"VeloraAdmin2026!",icon:ShieldCheck}
];

export function LoginForm(){
  const router=useRouter();
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError("");
    try{const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(!response.ok){setError("Email or password is incorrect.");return}const data=await response.json();router.replace(data.role==="ADMIN"?"/admin":data.role==="BUSINESS_OWNER"?"/business":"/account");router.refresh()}catch{setError("Unable to reach the server. Please try again.")}finally{setBusy(false)}
  }
  function useDemo(index:number){setEmail(demos[index].email);setPassword(demos[index].password);setError("")}
  return <form onSubmit={submit} className="glass relative w-full max-w-lg rounded-[2rem] p-7 md:p-9">
    <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold"><LockKeyhole/></span>
    <p className="eyebrow mt-8">Secure access</p><h1 className="mt-3 font-serif text-4xl">Welcome back</h1><p className="mt-2 text-sm text-white/35">Choose a demo role or enter your own credentials.</p>
    <div className="mt-5 grid grid-cols-3 gap-2">{demos.map((demo,index)=><button key={demo.label} type="button" onClick={()=>useDemo(index)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs transition hover:border-gold/50 hover:text-gold"><demo.icon className="mx-auto mb-2 h-4 w-4"/>{demo.label}</button>)}</div>
    <div className="mt-6 space-y-4">
      <label className="block text-xs text-white/40">Email<input className="field mt-2" value={email} onChange={event=>setEmail(event.target.value)} name="email" type="email" autoComplete="username" placeholder="you@example.com" required/></label>
      <label className="block text-xs text-white/40">Password<input className="field mt-2" value={password} onChange={event=>setPassword(event.target.value)} name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required/></label>
      {error&&<p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="btn btn-gold w-full disabled:opacity-60">{busy?<><Loader2 className="h-4 w-4 animate-spin"/>Signing in</>:"Sign in"}</button>
    </div>
    <div className="mt-5 flex justify-between text-xs"><a className="text-white/40 hover:text-gold" href="/forgot-password">Forgot password?</a><a className="text-white/40 hover:text-gold" href="/register">Create account</a></div>
  </form>;
}
