"use client";

import { FormEvent, InvalidEvent, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, MapPin, Send } from "lucide-react";
import { cropImageForUpload } from "@/lib/network/prepare-dashboard-image";

type EventRecord = { id:string; slug:string|null; title:string; eventType:string; summary:string; fullDescription:string; venue:string; address:string; location:string; region:string; format:string; startsAt:string; endsAt:string|null; priceType:string; priceDetails:string; bookingUrl:string|null; accessibility:string; ageGuidance:string; contactEmail:string; status:string; coverImageKey:string|null; coverImageAlt:string; adminFeedback:string|null; changesPending?:boolean };
type UpcomingEvent = Pick<EventRecord,"id"|"slug"|"title"|"eventType"|"summary"|"venue"|"location"|"startsAt"|"priceType"|"coverImageKey"|"coverImageAlt">;
const field = "mt-1 w-full rounded-xl border border-line-strong bg-surface-0 px-3 py-3 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";
const basicFields = [["title","Event name"],["eventType","Event type"],["venue","Venue"],["address","Address"],["location","Town or area"],["region","Region"],["bookingUrl","Event or information link","url"],["ageGuidance","Age guidance"],["contactEmail","Contact email","email"]] as const;
const requiredFields = new Set(["title","eventType","venue","location","region"]);

function pad(value:number){return String(value).padStart(2,"0");}

function DateTimePicker({name,label,required=false,initialValue=null}:{name:string;label:string;required?:boolean;initialValue?:string|null}){
  const now=new Date(), initial=initialValue?new Date(initialValue):null, [open,setOpen]=useState(false), [selected,setSelected]=useState<Date|null>(initial), [month,setMonth]=useState(new Date((initial||now).getFullYear(),(initial||now).getMonth(),1)), [hour,setHour]=useState(initial?pad(initial.getHours()):"18"), [minute,setMinute]=useState(initial?pad(initial.getMinutes()):"00");
  const firstDay=new Date(month.getFullYear(),month.getMonth(),1).getDay(), daysInMonth=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const blanks=(firstDay+6)%7, days=Array.from({length:daysInMonth},(_,index)=>index+1);
  const value=selected?`${selected.getFullYear()}-${pad(selected.getMonth()+1)}-${pad(selected.getDate())}T${hour}:${minute}`:"";
  const display=selected?`${selected.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} at ${hour}:${minute}`:"";
  function choose(day:number){setSelected(new Date(month.getFullYear(),month.getMonth(),day));}
  return <label className="relative text-sm font-bold">{label}
    <input type="hidden" name={name} value={value}/>
    <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(!open)} className={`${field} flex min-h-12 items-center justify-between text-left ${display?"text-fg":"text-fg-muted"}`}>
      <span>{display||"Choose a date and time"}</span><CalendarDays size={18} className="text-accent"/>
    </button>
    <input value={display} onChange={()=>{}} required={required} tabIndex={-1} aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0"/>
    {open&&<div role="dialog" aria-label={`${label} calendar`} className="absolute z-30 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-accent/50 bg-[#09090b] p-4 text-white shadow-[0_20px_60px_rgba(255,0,168,.22)]">
      <div className="flex items-center justify-between"><button type="button" aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} className="rounded-full p-2 text-accent hover:bg-accent/15"><ChevronLeft size={20}/></button><strong>{month.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</strong><button type="button" aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} className="rounded-full p-2 text-accent hover:bg-accent/15"><ChevronRight size={20}/></button></div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-fg-muted">{["M","T","W","T","F","S","S"].map((day,index)=><span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">{Array.from({length:blanks}).map((_,index)=><span key={`blank-${index}`}/>)}{days.map(day=>{const active=selected?.getFullYear()===month.getFullYear()&&selected?.getMonth()===month.getMonth()&&selected?.getDate()===day;return <button key={day} type="button" onClick={()=>choose(day)} className={`aspect-square rounded-full text-sm transition ${active?"bg-accent font-bold text-white":"hover:bg-accent/20 hover:text-accent"}`}>{day}</button>})}</div>
      <div className="mt-4 flex items-end gap-3 border-t border-line pt-4"><label className="flex-1 text-xs text-fg-muted">Hour<select value={hour} onChange={event=>setHour(event.target.value)} className={`${field} text-white`}>{Array.from({length:24},(_,index)=><option key={index} value={pad(index)}>{pad(index)}</option>)}</select></label><label className="flex-1 text-xs text-fg-muted">Minutes<select value={minute} onChange={event=>setMinute(event.target.value)} className={`${field} text-white`}>{["00","15","30","45"].map(value=><option key={value}>{value}</option>)}</select></label><button type="button" disabled={!selected} onClick={()=>setOpen(false)} className="rounded-full bg-accent px-4 py-3 text-sm font-bold text-white disabled:opacity-40">Done</button></div>
    </div>}
  </label>;
}

async function prepareCoverImage(file:File){
  return cropImageForUpload(file,1080,1350,"event-cover.webp");
}

const media=(key:string)=>`/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;
const statusLabels:Record<string,string>={draft:"Draft",pending:"Awaiting approval",approved:"Live",rejected:"Changes requested",cancelled:"Cancelled",past:"Past"};

export function EventManager({initialEvents,upcomingEvents}:{initialEvents:EventRecord[];upcomingEvents:UpcomingEvent[]}){
  const [events]=useState(initialEvents), [open,setOpen]=useState(false), [editing,setEditing]=useState<EventRecord|null>(null), [message,setMessage]=useState(""), [priceType,setPriceType]=useState("free");
  const invalidHandled=useRef(false);

  function handleInvalid(event:InvalidEvent<HTMLFormElement>){
    if(invalidHandled.current) return;
    invalidHandled.current=true; event.preventDefault();
    const invalidControl=event.target as HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement;
    const control=(invalidControl.getAttribute("aria-hidden")==="true"?invalidControl.previousElementSibling:invalidControl) as HTMLElement;
    setMessage("Please complete the highlighted field.");
    control.scrollIntoView({behavior:"smooth",block:"center"});
    control.focus({preventScroll:true});
    control.classList.add("border-accent","ring-2","ring-accent","animate-pulse");
    window.setTimeout(()=>{control.classList.remove("border-accent","ring-2","ring-accent","animate-pulse");invalidHandled.current=false;},1800);
  }

  async function action(body:object){
    const response=await fetch("/api/network/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}), result=await response.json() as {error?:string};
    if(!response.ok) throw new Error(result.error||"Could not save the event.");
    location.reload();
  }

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); invalidHandled.current=false; setMessage("Preparing your image...");
    try{
      const form=new FormData(event.currentTarget), file=form.get("image") as File, alt=String(form.get("coverImageAlt"));
      let coverImageKey=editing?.coverImageKey||"";
      if(file?.size){const processedFile=await prepareCoverImage(file); setMessage("Uploading your image...");const image=new FormData(); image.set("image",processedFile); image.set("eventId",editing?.id||"new"); image.set("altText",alt);const imageResponse=await fetch("/api/network/event-image",{method:"POST",body:image}), imageResult=await imageResponse.json() as {key?:string;error?:string};if(!imageResponse.ok||!imageResult.key) throw new Error(imageResult.error||"Image upload failed.");coverImageKey=imageResult.key;}
      if(!coverImageKey) throw new Error("Choose a cover image.");
      setMessage("Submitting your event...");
      const value=(name:string)=>String(form.get(name)||"");
      await action({action:editing?"update":"create",...(editing?{eventId:editing.id}:{}),data:{title:value("title"),eventType:value("eventType"),summary:value("summary"),fullDescription:value("fullDescription"),venue:value("venue"),address:value("address"),location:value("location"),region:value("region"),format:value("format"),startsAt:new Date(value("startsAt")).toISOString(),endsAt:value("endsAt")?new Date(value("endsAt")).toISOString():"",priceType:value("priceType"),priceDetails:value("priceDetails"),bookingUrl:value("bookingUrl"),accessibility:value("accessibility"),ageGuidance:value("ageGuidance"),contactEmail:value("contactEmail"),coverImageKey,coverImageAlt:alt}});
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save the event.");}
  }

  return <main className="relative min-h-screen overflow-hidden pb-24 pt-24">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] [mask-image:linear-gradient(to_bottom,black_0%,black_48%,transparent_100%)]">
      <div className="absolute inset-0 bg-[url('/images/north-east/3.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0/30 via-surface-0/75 to-surface-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,0,188,.28),transparent_42%)]" />
    </div>
    <div className="container-shell relative z-10">
    <section className="max-w-4xl pt-8 md:pt-14">
      <a href="/network/dashboard" className="text-sm font-bold text-accent">← Dashboard</a>
      <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-accent">Member events</p>
      <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-5xl leading-[.95] md:text-7xl">Share what you’re<br/><span className="text-accent">putting on</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-fg-muted md:text-lg">Add your event once and we’ll prepare it for the Network calendar. You can manage updates, links and event details here.</p></div>
        <button onClick={()=>{setEditing(null);setPriceType("free");setOpen(!open);}} className="shrink-0 rounded-full bg-accent px-6 py-3 font-bold text-white shadow-[0_12px_36px_rgba(255,0,188,.24)]">{open?"Close form":"Add an event"}</button>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[{icon:Send,title:"Submit",copy:"Add the details, image and link."},{icon:Clock3,title:"Review",copy:"NAMI checks it before publishing."},{icon:CheckCircle2,title:"Live",copy:"Approved events join the public calendar."}].map(({icon:Icon,title,copy},index)=><article key={title} className="rounded-2xl border border-line bg-surface-1/90 p-4 backdrop-blur"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent"><Icon size={17}/></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">Step {index+1}</p><h2 className="text-lg">{title}</h2></div></div><p className="mt-3 text-sm text-fg-muted">{copy}</p></article>)}
      </div>
    </section>
    {open&&<form key={editing?.id||"new-event"} onSubmit={submit} onInvalid={handleInvalid} className="mt-8 grid gap-4 rounded-3xl border border-line bg-surface-1 p-5 md:grid-cols-2">
      <h2 className="text-2xl md:col-span-2">{editing?`Edit ${editing.title}`:"Add an event"}</h2>
      {basicFields.map(([name,label,type])=><label key={name} className="text-sm font-bold">{label}<input name={name} type={type||"text"} defaultValue={editing?.[name]??""} required={requiredFields.has(name)} className={field}/></label>)}
      <DateTimePicker name="startsAt" label="Starts" initialValue={editing?.startsAt} required/>
      <DateTimePicker name="endsAt" label="Ends" initialValue={editing?.endsAt}/>
      <label className="text-sm font-bold">Format<select name="format" defaultValue={editing?.format||"in_person"} className={field}><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label>
      <label className="text-sm font-bold">Price<select name="priceType" value={priceType} onChange={event=>setPriceType(event.target.value)} className={field}><option value="free">Free</option><option value="paid">Paid</option></select></label>
      {priceType==="paid"&&<label className="text-sm font-bold">Ticket price or price range<input name="priceDetails" required placeholder="For example, £8 or £8 to £12" className={field}/></label>}
      <label className="text-sm font-bold md:col-span-2">Short summary<textarea name="summary" defaultValue={editing?.summary||""} required minLength={20} maxLength={320} className={field}/></label>
      <label className="text-sm font-bold md:col-span-2">Full description<textarea name="fullDescription" defaultValue={editing?.fullDescription||""} required minLength={20} rows={7} className={field}/></label>
      <label className="text-sm font-bold md:col-span-2">Accessibility information<textarea name="accessibility" defaultValue={editing?.accessibility||""} className={field}/></label>
      <label className="text-sm font-bold">Cover image<input name="image" type="file" accept="image/*" required={!editing?.coverImageKey} className={field}/><span className="mt-2 block text-xs font-normal text-fg-muted">{editing?.coverImageKey?"Choose a photo only if you want to replace the current image.":"Choose a photo from your device. We'll crop, resize and optimise it for you."}</span></label>
      <label className="text-sm font-bold">Image description<input name="coverImageAlt" defaultValue={editing?.coverImageAlt||""} required minLength={4} className={field}/><span className="mt-2 block text-xs font-normal text-fg-muted">Briefly describe what is in the image for people using screen readers.</span></label>
      {message&&<p role="status" className="text-sm text-accent md:col-span-2">{message}</p>}
      <button className="rounded-full bg-accent px-5 py-3 font-bold text-white md:col-span-2">{editing?.status==="approved"?"Submit changes for approval":"Submit for approval"}</button>
    </form>}
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Manage</p><h2 className="mt-2 text-3xl md:text-5xl">Your events</h2></div><span className="text-sm text-fg-muted">{events.length} {events.length===1?"event":"events"}</span></div>
      {events.length===0?<div className="mt-6 rounded-3xl border border-dashed border-accent/40 bg-surface-1/80 p-8 text-center"><CalendarDays className="mx-auto text-accent"/><h3 className="mt-4 text-2xl">Nothing here yet</h3><p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">Add your first event and submit it for the public Network calendar.</p></div>:<div className="mt-6 grid gap-4 md:grid-cols-2">{events.map(event=><article key={event.id} className="overflow-hidden rounded-3xl border border-line bg-surface-1/95 shadow-[0_18px_55px_rgba(0,0,0,.24)]"><div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr]">{event.coverImageKey?<img src={media(event.coverImageKey)} alt={event.coverImageAlt} className="h-full min-h-48 w-full object-cover"/>:<div className="min-h-48 bg-[url('/network-news/creative-night.jpg')] bg-cover bg-center"/>}<div className="p-5"><div className="flex flex-wrap items-start justify-between gap-2"><span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{event.changesPending?"Changes awaiting approval":statusLabels[event.status]||event.status}</span><span className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">{event.eventType}</span></div><h3 className="mt-4 text-2xl">{event.title}</h3><p className="mt-2 text-xs leading-5 text-fg-muted">{new Date(event.startsAt).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/London"})}</p><p className="mt-1 flex items-center gap-1 text-xs text-fg-subtle"><MapPin size={12} className="text-accent"/>{event.venue}, {event.location}</p>{event.adminFeedback&&<p className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/5 p-3 text-xs text-amber-200">{event.adminFeedback}</p>}<div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">{event.status==="approved"&&event.slug&&<a href={`/network/events/${event.slug}`} className="text-sm font-bold text-accent">View event</a>}{event.status!=="cancelled"&&!event.changesPending&&<button onClick={()=>{setEditing(event);setPriceType(event.priceType);setOpen(true);window.scrollTo({top:0,behavior:"smooth"});}} className="text-sm font-bold">Edit</button>}<button onClick={()=>void action({action:"duplicate",eventId:event.id})} className="text-sm font-bold">Duplicate</button>{event.status!=="cancelled"&&<button onClick={()=>void action({action:"cancel",eventId:event.id})} className="text-sm font-bold text-red-300">Cancel</button>}</div></div></div></article>)}</div>}
    </section>
    <section className="mt-20 border-t border-line pt-14">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Around the Network</p><h2 className="mt-2 text-3xl md:text-5xl">Upcoming events</h2></div><a href="/network/events" className="hidden items-center gap-1 text-sm font-bold text-accent sm:inline-flex">View the calendar <ArrowUpRight size={15}/></a></div>
      {upcomingEvents.length>0?<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{upcomingEvents.map(event=><a key={event.id} href={event.slug?`/network/events/${event.slug}`:"/network/events"} className="group overflow-hidden rounded-3xl border border-line bg-surface-1 transition hover:-translate-y-1 hover:border-accent/50"><div className="relative aspect-[4/3] overflow-hidden">{event.coverImageKey?<img src={media(event.coverImageKey)} alt={event.coverImageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>:<div className="h-full bg-[url('/network-news/creative-night.jpg')] bg-cover bg-center"/>}<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"/><span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">{event.eventType}</span><p className="absolute inset-x-4 bottom-4 text-sm font-bold text-accent">{new Date(event.startsAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"Europe/London"})}</p></div><div className="p-5"><h3 className="text-2xl">{event.title}</h3><p className="mt-3 flex items-center gap-1 text-xs text-fg-subtle"><MapPin size={12} className="text-accent"/>{event.venue}, {event.location}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-fg-muted">{event.summary}</p></div></a>)}</div>:<div className="mt-7 rounded-3xl border border-line bg-surface-1 p-7"><p className="text-fg-muted">There are no upcoming public events yet. Yours could be the first.</p></div>}
      <a href="/network/events" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-accent sm:hidden">View the calendar <ArrowUpRight size={15}/></a>
    </section>
    </div>
  </main>;
}
