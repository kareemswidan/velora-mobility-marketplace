import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const key = () => new TextEncoder().encode(process.env.JWT_SECRET || "development-only-secret-change-me-now");
export async function createToken(payload:{id:string;email:string;role:string}) { return new SignJWT(payload).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(key()); }
export async function getSession(){ const token=cookies().get("velora_session")?.value; if(!token)return null; try{return (await jwtVerify(token,key())).payload as {id:string;email:string;role:string};}catch{return null;} }
