import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

function clean(value:unknown,max=80){return String(value||"").trim().slice(0,max)}

export async function POST(request:Request){
  const session=await getSession();
  if(session?.role!=="CUSTOMER")return NextResponse.json({error:"Sign in required"},{status:401});
  const body=await request.json();
  const name=clean(body.name),make=clean(body.make),model=clean(body.model),plate=clean(body.plate,30);
  if(!name||!make||!model)return NextResponse.json({error:"Name, make and model are required"},{status:400});
  const count=await prisma.vehicle.count({where:{userId:session.id}});
  if(count>=10)return NextResponse.json({error:"Vehicle limit reached"},{status:409});
  const vehicle=await prisma.vehicle.create({data:{name,make,model,plate:plate||null,userId:session.id}});
  return NextResponse.json(vehicle,{status:201});
}

export async function DELETE(request:Request){
  const session=await getSession();
  if(session?.role!=="CUSTOMER")return NextResponse.json({error:"Sign in required"},{status:401});
  const{id}=await request.json();
  if(!id)return NextResponse.json({error:"Vehicle id is required"},{status:400});
  await prisma.vehicle.deleteMany({where:{id:String(id),userId:session.id}});
  return NextResponse.json({ok:true});
}
