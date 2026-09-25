import { and, asc, eq, gte } from "drizzle-orm";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { EventManager } from "./event-manager";

export const dynamic="force-dynamic";

export default async function EventsDashboard(){
  const auth=await requireMemberSession(), db=await getNetworkDb();
  const [events,revisions,upcoming]=await Promise.all([
    db.select().from(schema.networkEvents).where(eq(schema.networkEvents.memberId,auth.member.id)).orderBy(asc(schema.networkEvents.startsAt)),
    db.select({eventId:schema.eventRevisions.eventId}).from(schema.eventRevisions).where(and(eq(schema.eventRevisions.memberId,auth.member.id),eq(schema.eventRevisions.status,"pending"))),
    db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status,"approved"),gte(schema.networkEvents.startsAt,new Date()))).orderBy(asc(schema.networkEvents.startsAt)).limit(3),
  ]);
  const pending=new Set(revisions.map((revision)=>revision.eventId));
  return <EventManager initialEvents={events.map((event)=>({...event,startsAt:event.startsAt.toISOString(),endsAt:event.endsAt?.toISOString()||null,changesPending:pending.has(event.id)}))} upcomingEvents={upcoming.map((event)=>({id:event.id,slug:event.slug,title:event.title,eventType:event.eventType,summary:event.summary,venue:event.venue,location:event.location,startsAt:event.startsAt.toISOString(),priceType:event.priceType,coverImageKey:event.coverImageKey,coverImageAlt:event.coverImageAlt}))}/>;
}
