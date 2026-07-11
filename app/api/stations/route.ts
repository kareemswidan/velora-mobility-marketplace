import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(){
  return NextResponse.json(await prisma.station.findMany({
    where:{OR:[{businessId:null},{business:{status:"APPROVED"}}]},
    orderBy:{name:"asc"}
  }));
}
