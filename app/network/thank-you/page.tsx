import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, AtSign, Check, MessageCircle, Search, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";
const instagramUrl = "https://www.instagram.com/namicreativeuk/";

export const metadata: Metadata = { title: "You're in - NAMI Creative Network", description: "Thanks for joining NAMI Creative Network. Share your work, join the community spaces, and tag NAMI in your latest projects.", alternates: { canonical: "/network/thank-you" }, robots: { index: false, follow: false } };

const nextSteps = [
  { title: "Show the group what you're making", body: "Use the Facebook group to post projects, launches, offers and events you want more local people to see." },
  { title: "Get into the conversation", body: "Use the WhatsApp community for questions, support, useful links and the day-to-day chat around creative work up here." },
  { title: "Tag NAMI in your latest posts", body: "Tag @namicreativeuk on Instagram so I can keep up with your work and share the right things with the wider audience." },
];

export default function NetworkThankYouPage() {
  return (
    <div data-compact-footer="network-thank-you">
      <PageHero eyebrow="You're in the Network" title={<>Your welcome email is <span className="text-accent">on its way</span></>} lead="Check your inbox for a message from NAMI Creative. If it is not there, check your spam or junk folder and add hello@namicreative.co.uk to your contacts." backgroundImage="/images/north-east/4.jpg">
        <span className="inline-grid size-12 place-items-center rounded-md bg-accent text-white"><Check size={22} /></span>
      </PageHero>
      <section className="container-shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
          <div>
            <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] md:text-6xl">Your directory profile is next</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-fg-muted md:text-lg">I&apos;ll add your profile to the Creative Directory shortly. Have a look around while I get yours ready.</p>
            <Link href="/network/directory" className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white">Explore the directory <Search size={15} /></Link>
          </div>
          <div className="grid gap-px bg-line-strong sm:grid-cols-3">
            {nextSteps.map((step) => <article key={step.title} className="bg-surface-1 p-6 md:p-8"><h3 className="text-xl font-semibold leading-tight">{step.title}</h3><p className="mt-4 text-sm leading-relaxed text-fg-muted">{step.body}</p></article>)}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-5 border-y border-line py-6 text-sm font-semibold">
          <a href={facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">Facebook group <Users size={15} /></a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">WhatsApp community <MessageCircle size={15} /></a>
          <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">Follow and tag NAMI <AtSign size={15} /></a>
        </div>
        <div className="mt-12 grid overflow-hidden border border-line bg-surface-1 md:grid-cols-[1fr_auto] md:items-center">
          <div className="p-7 md:p-10"><h2 className="text-3xl font-semibold">Want your work to turn into more paid enquiries?</h2><p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">Creator Wave Workshop looks at the path people take before they enquire, buy, book or commission you.</p></div>
          <Link href="/offers/creator-wave-workshop" className="m-7 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-semibold text-white md:m-10">View Creator Wave Workshop <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </div>
  );
}
