import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export const dynamic="force-dynamic";

export async function GET(){
  return NextResponse.json(await prisma.station.findMany({
    where:{OR:[{businessId:null},{business:{status:"APPROVED"}}]},
    orderBy:{name:"asc"}
  }));
}
