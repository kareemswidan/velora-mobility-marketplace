import {et} from "@/lib/api-i18n";import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function PATCH(){
  const session=await getSession();
  if(!session)return NextResponse.json({error:await et("err_signin_required")},{status:401});
  const result=await prisma.notification.updateMany({where:{userId:session.id,read:false},data:{read:true}});
  return NextResponse.json({ok:true,updated:result.count});
}
