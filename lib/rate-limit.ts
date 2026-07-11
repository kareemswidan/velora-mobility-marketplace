type Entry={count:number;resetAt:number};const store=new Map<string,Entry>();
export function rateLimit(key:string,limit=10,windowMs=60_000){const now=Date.now(),entry=store.get(key);if(!entry||entry.resetAt<=now){store.set(key,{count:1,resetAt:now+windowMs});return{ok:true,remaining:limit-1}}entry.count++;if(entry.count>limit)return{ok:false,remaining:0,retryAfter:Math.ceil((entry.resetAt-now)/1000)};return{ok:true,remaining:limit-entry.count}}
export function requestKey(request:Request,scope:string){return `${scope}:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"local"}`}
