import { z } from "zod";
import { getNetworkDb, schema } from "@/lib/network-db";

const input=z.object({eventId:z.string().uuid(),eventType:z.enum(["page_view","booking_click","organiser_click","calendar_click","share"]),anonymousSessionId:z.string().trim().min(8).max(100),metadata:z.record(z.string(),z.unknown()).optional().default({})});

export async function POST(request:Request){
  const parsed=input.safeParse(await request.json().catch(()=>null));
  if(!parsed.success) return Response.json({error:"Invalid event analytics payload."},{status:400});
  const db=await getNetworkDb();
  await db.insert(schema.eventAnalytics).values({id:crypto.randomUUID(),...parsed.data,createdAt:new Date()});
  return Response.json({ok:true},{status:201});
}
