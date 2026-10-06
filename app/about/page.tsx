"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/socials";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { values } from "@/lib/content/values";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";

export default function AboutPage() {
  return (
    <>
      <PageHero
        backgroundImage="/images/north-east/3.jpg"
        backgroundPosition="center"
        eyebrow="About - NAMI Creative"
        title={
          <>
            Making waves of{" "}
            <span className="text-gradient sm:block">creative impact</span>
          </>
        }
        lead="Through NAMI, I work with North East businesses on their brand, website, content and automation while building a creative network that helps local people find each other, get discovered and create more opportunities together."
      />

      {/* Founder note */}
      <section className="border-t border-line bg-surface-0 py-20 md:py-28">
        <div className="container-shell relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16 lg:gap-20"
          >
            <motion.div variants={fadeUp}>
              <div className="relative aspect-3/4 overflow-hidden border border-line">
                <Image
                  src="/assets/images/bb.jpg"
                  alt="Joe Wilson, founder of NAMI Creative"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mono-label mt-4">Joe Wilson - Founder, NAMI Creative</p>
            </motion.div>
            <motion.div variants={fadeUp} className="max-w-2xl space-y-6">
              <p className="mono-label">01 / The founder</p>
              <p className="type-subsection-title">
                I&apos;m <span className="text-gradient">Joe Wilson</span>
              </p>
              <div className="space-y-5">
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I help creatives, businesses and brands find their people and get
                  their work seen.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  That can mean anything from design and content to web development
                  and automation.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I help make all those parts connect.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I work out what you need to say, who needs to hear it and what
                  should happen next, then design and build around that.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I have over two decades of marketing and design experience (makes
                  me feel old).
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  A lot of which was held at a head of department level where
                  campaigns I&apos;ve created have landed clients in national
                  publications, sold out events and even Westminster.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I now use that experience to create my own path, business and
                  dreams.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  Speaking of dreams, I also run the NAMI Creative Network, a
                  growing community and directory for artists, makers, freelancers
                  and independent businesses across the North East.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  Members can create profiles, share their work, promote events and
                  contribute their own stories, helping more local talent get found
                  and hired.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  NAMI grew from a love for the North East and the people here who
                  keep making, building, opening, posting, filming, designing,
                  playing and putting themselves forward.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  The thread through all of it is pretty simple: clear thinking,
                  good work and more support for people doing proper work up here.
                </p>
                <p className="text-fg-muted md:text-lg leading-relaxed">
                  I&apos;m North East through and through, proud dad, and I love
                  nothing more than to see the people around me win.
                </p>
                <p className="font-medium text-fg md:text-lg leading-relaxed">
                  North East forever!
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/brandingbyjoewilson/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
                >
                  <LinkedinIcon size={16} aria-hidden />
                  Connect on LinkedIn
                  <ArrowUpRight
                    size={12}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
                >
                  Start a conversation
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Creative Network */}
      <section className="relative isolate overflow-hidden border-t border-line py-20 md:py-28">
        <ParallaxBackdrop src="/images/north-east/2.jpg" position="center 48%" overlay={0.84} />
        <div className="container-shell relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20"
          >
            <motion.div variants={fadeUp} className="max-w-2xl">
              <p className="mono-label mb-5">02 / NAMI Creative Network</p>
              <h2 className="type-section-title">
                One place to find creative people across the North East
              </h2>
              <p className="mt-6 text-fg-muted md:text-lg leading-relaxed">
                The NAMI Creative Network is a public directory of artists,
                freelancers, makers and independent businesses. It gives people
                a simple way to find local talent and see what they do.
              </p>
              <p className="mt-5 text-fg-muted md:text-lg leading-relaxed">
                I also use it to share member work, send useful opportunities
                and make introductions when somebody asks who I&apos;d recommend.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/network"
                  className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
                >
                  Join the network
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-md border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:bg-white/5"
                >
                  Work with me
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
              <div className="bg-surface-0/90 p-7">
                <h3 className="type-card-title">Visibility</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Member features and posts that put more local work in front
                  of the right people.
                </p>
              </div>
              <div className="bg-surface-0/90 p-7">
                <h3 className="type-card-title">Useful updates</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Emails with local people to follow, events worth knowing
                  about and opportunities for members.
                </p>
              </div>
              <div className="bg-surface-0/90 p-7">
                <h3 className="type-card-title">Introductions</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  A reliable way to find the right person when somebody needs
                  a photographer, designer, maker or specialist.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Values */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <motion.span className="mono-label mb-5 block" variants={fadeUp}>
              How I think
            </motion.span>
            <motion.h2
              className="type-section-title"
              variants={fadeUp}
            >
              What you can expect <span className="text-gradient">from me</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stageFast}
            className="grid gap-6 md:grid-cols-3 md:gap-8"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={cardIn} className="h-full">
                <article className="h-full border border-line bg-surface-1 p-8 transition-colors hover:border-accent/45 md:p-10">
                    <h3 className="type-card-title">
                      {value.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-fg-muted">
                      {value.body}
                    </p>
                </article>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </>
  );
}
