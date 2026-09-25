"use client";

import { FormEvent, InvalidEvent, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type EventRecord = { id:string; slug:string|null; title:string; eventType:string; summary:string; fullDescription:string; venue:string; address:string; location:string; region:string; format:string; startsAt:string; endsAt:string|null; priceType:string; priceDetails:string; bookingUrl:string|null; accessibility:string; ageGuidance:string; contactEmail:string; status:string; coverImageKey:string|null; coverImageAlt:string; adminFeedback:string|null; changesPending?:boolean };
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
  if(!file.type.startsWith("image/")) throw new Error("Choose a JPG, PNG or WebP image.");
  const bitmap=await createImageBitmap(file), canvas=document.createElement("canvas");
  canvas.width=1080; canvas.height=1350;
  const context=canvas.getContext("2d");
  if(!context) throw new Error("Image processing is unavailable in this browser.");
  const scale=Math.max(canvas.width/bitmap.width,canvas.height/bitmap.height), sourceWidth=canvas.width/scale, sourceHeight=canvas.height/scale;
  context.drawImage(bitmap,(bitmap.width-sourceWidth)/2,(bitmap.height-sourceHeight)/2,sourceWidth,sourceHeight,0,0,canvas.width,canvas.height);
  bitmap.close();
  let quality=.88, blob:Blob|null=null;
  do { blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality)); quality-=.08; }
  while(blob&&blob.size>2*1024*1024&&quality>=.56);
  if(!blob) throw new Error("The image could not be prepared. Try another file.");
  if(blob.size>2*1024*1024) throw new Error("This image is still too large after optimisation. Try a smaller image.");
  return new File([blob],"event-cover.webp",{type:"image/webp"});
}

export function EventManager({initialEvents}:{initialEvents:EventRecord[]}){
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

  return <main className="container-shell min-h-screen pb-24 pt-24">
    <div className="flex items-center justify-between"><div><a href="/network/dashboard" className="text-sm text-accent">← Dashboard</a><h1 className="mt-3 text-4xl">Your events</h1></div><button onClick={()=>{setEditing(null);setPriceType("free");setOpen(!open);}} className="rounded-full bg-accent px-5 py-3 font-bold text-white">{open?"Close":"Add an event"}</button></div>
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
      <label className="text-sm font-bold">Cover image<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!editing?.coverImageKey} className={field}/><span className="mt-2 block text-xs font-normal text-fg-muted">{editing?.coverImageKey?"Choose a file only if you want to replace the current image.":"Choose a clear portrait image. We'll crop and optimise it for you."}</span></label>
      <label className="text-sm font-bold">Image description<input name="coverImageAlt" defaultValue={editing?.coverImageAlt||""} required minLength={4} className={field}/><span className="mt-2 block text-xs font-normal text-fg-muted">Briefly describe what is in the image for people using screen readers.</span></label>
      {message&&<p role="status" className="text-sm text-accent md:col-span-2">{message}</p>}
      <button className="rounded-full bg-accent px-5 py-3 font-bold text-white md:col-span-2">{editing?.status==="approved"?"Submit changes for approval":"Submit for approval"}</button>
    </form>}
    <section className="mt-8 grid gap-4 md:grid-cols-2">{events.map(event=><article key={event.id} className="rounded-2xl border border-line bg-surface-1 p-5"><div className="flex justify-between gap-3"><h2 className="text-2xl">{event.title}</h2><span className="text-xs text-accent">{event.changesPending?"Changes awaiting approval":event.status}</span></div><p className="mt-2 text-sm text-fg-muted">{new Date(event.startsAt).toLocaleString("en-GB")} · {event.venue}, {event.location}</p>{event.adminFeedback&&<p className="mt-3 text-sm text-amber-300">{event.adminFeedback}</p>}<div className="mt-4 flex flex-wrap gap-3">{event.status==="approved"&&event.slug&&<a href={`/network/events/${event.slug}`} className="text-sm font-bold text-accent">View</a>}{event.status!=="cancelled"&&!event.changesPending&&<button onClick={()=>{setEditing(event);setPriceType(event.priceType);setOpen(true);window.scrollTo({top:0,behavior:"smooth"});}} className="text-sm font-bold">Edit</button>}<button onClick={()=>void action({action:"duplicate",eventId:event.id})} className="text-sm font-bold">Duplicate</button>{event.status!=="cancelled"&&<button onClick={()=>void action({action:"cancel",eventId:event.id})} className="text-sm font-bold text-red-300">Cancel</button>}</div></article>)}</section>
  </main>;
}
