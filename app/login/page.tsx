import {LoginForm} from "@/components/LoginForm";

export default function LoginPage(){
  return <section className="relative grid min-h-[calc(100vh-80px)] place-items-center overflow-hidden px-5 py-16">
    <div className="aurora left-1/4 top-1/4 h-80 w-80 bg-emerald-500/15"/>
    <LoginForm/>
  </section>
}
