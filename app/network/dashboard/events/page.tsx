import { and, asc, eq } from "drizzle-orm";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { EventManager } from "./event-manager";

export const dynamic="force-dynamic";

export default async function EventsDashboard(){
  const auth=await requireMemberSession(), db=await getNetworkDb();
  const [events,revisions]=await Promise.all([
    db.select().from(schema.networkEvents).where(eq(schema.networkEvents.memberId,auth.member.id)).orderBy(asc(schema.networkEvents.startsAt)),
    db.select({eventId:schema.eventRevisions.eventId}).from(schema.eventRevisions).where(and(eq(schema.eventRevisions.memberId,auth.member.id),eq(schema.eventRevisions.status,"pending"))),
  ]);
  const pending=new Set(revisions.map((revision)=>revision.eventId));
  return <EventManager initialEvents={events.map((event)=>({...event,startsAt:event.startsAt.toISOString(),endsAt:event.endsAt?.toISOString()||null,changesPending:pending.has(event.id)}))}/>;
}
