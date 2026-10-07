import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, Users } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import { PageHero } from "@/components/sections/page-hero";

const instagramUrl = "https://www.instagram.com/namicreativeuk/";
const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";

export const metadata: Metadata = { title: "Thanks - NAMI Creative", description: "Thanks for getting in touch with NAMI Creative. Joe will review your enquiry and come back to you shortly.", alternates: { canonical: "/thank-you" }, robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return (
    <div data-compact-footer="compact-thank-you">
      <PageHero eyebrow="Enquiry received" title={<>Thanks. I&apos;ll take a <span className="text-accent">proper look</span></>} lead="Your message has landed. I usually respond within one working day. If I can help, I'll suggest a clear next step. If it isn't the right fit, I'll be straight with you." backgroundImage="/assets/images/nami-office.webp">
        <span className="inline-grid size-12 place-items-center rounded-md bg-accent text-white"><Check size={22} aria-hidden /></span>
      </PageHero>
      <section className="container-shell py-16 md:py-24">
        <div className="grid gap-px overflow-hidden border border-line bg-line-strong lg:grid-cols-2">
          <article className="bg-surface-1 p-7 md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight">See the work behind the words</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">See how I help people make their brand, content, website and buyer journey clearer and easier to act on.</p>
            <Link href="/work" className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white">See selected work <ArrowUpRight size={14} /></Link>
          </article>
          <article className="bg-surface-1 p-7 md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight">Interested in North East creativity?</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">Follow the Network, meet local creatives and see the work being made across the region.</p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold">
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-line py-2 hover:border-accent hover:text-accent">Instagram <InstagramIcon size={15} /></a>
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-line py-2 hover:border-accent hover:text-accent">Facebook <Users size={15} /></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-line py-2 hover:border-accent hover:text-accent">WhatsApp <MessageCircle size={15} /></a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
