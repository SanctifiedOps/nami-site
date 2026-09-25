"use client";

import { useEffect } from "react";

export function EventAnalytics({eventId}:{eventId:string}){
  useEffect(()=>{
    const key="nami-event-session";
    const sessionId=localStorage.getItem(key)||crypto.randomUUID();
    localStorage.setItem(key,sessionId);
    const record=(eventType:string)=>{void fetch("/api/network/event-analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({eventId,eventType,anonymousSessionId:sessionId})});};
    record("page_view");
    const click=(event:MouseEvent)=>{const target=(event.target as HTMLElement).closest<HTMLElement>("[data-event-action]");if(target?.dataset.eventAction)record(target.dataset.eventAction);};
    document.addEventListener("click",click);
    return()=>document.removeEventListener("click",click);
  },[eventId]);
  return null;
}
