"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Handshake, Mail, Users } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/socials";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { values } from "@/lib/content/values";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About - NAMI Creative"
        title={
          <>
            Built in Newcastle,{" "}
            <span className="text-gradient sm:block">backing the North East</span>
          </>
        }
        lead="I'm Joe Wilson. I help North East businesses, brands and creators get seen, understood, and backed through marketing work, websites, content, automation, and the NAMI Creative Network."
      />

      {/* Story */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
        >
          <motion.p className="mono-label md:mt-2" variants={fadeUp}>
            01 / The story
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
            <p className="text-2xl font-medium leading-[1.03] tracking-tight md:text-3xl">
              Marketing services are one part of NAMI, but they are not the whole story.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              The work starts with helping businesses figure out what they are
              trying to say, who they are saying it to, and how the brand,
              content, website, and working bits should fit around that.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I also care about the place the work comes from. NAMI grew out of
              a love for the North East and the people here who keep making,
              building, opening, posting, filming, designing, playing, and
              putting themselves forward.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              That is the thread through all of it: clear thinking, good
              execution, and more support for the people doing proper work up
              here.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* North East */}
      <section className="border-t border-line bg-surface-1/30 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
          >
            <motion.p className="mono-label md:mt-2" variants={fadeUp}>
              02 / The North East
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
              <p className="text-2xl font-medium leading-[1.03] tracking-tight md:text-3xl">
                I want more North East people to be seen, trusted, hired, and taken seriously.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                I am a born and bred Newcastle lad, a proud dad, and I love
                seeing people around here win. The region is full of artists,
                musicians, makers, freelancers, local businesses, and
                independent brands doing work with care behind it.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                The marketing services help businesses get sorted properly: the
                words, the website, the content, the automation, and the route
                from interest to enquiry. The creator network gives local talent
                more chances to be found, featured, referred, and backed.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                They work hand in hand. Better businesses make the region stronger. A stronger creative network gives those businesses more people to work with, champion, and recommend.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Creative Network */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20"
          >
            <motion.div variants={fadeUp} className="max-w-2xl">
              <p className="mono-label mb-5">03 / NAMI Creative Network</p>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[0.98] tracking-tight md:leading-[0.96]">
                A growing network for the people making the North East feel alive
              </h2>
              <p className="mt-6 text-fg-muted md:text-lg leading-relaxed">
                NAMI Creative Network is where I keep track of local creators,
                artists, freelancers, small businesses, and independent brands.
                It helps me spotlight the right work, send better roundups, make
                useful introductions, and point opportunities towards the people
                who should hear about them.
              </p>
              <p className="mt-5 text-fg-muted md:text-lg leading-relaxed">
                If the client work is about helping businesses show up better,
                the network is about making sure more North East people have a
                place to be seen when they do.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/network"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
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
                  className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
                >
                  Talk about the marketing work
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Users size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">Visibility</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Features, reposts, roundups, and spotlights for people doing
                  proper work across the region.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Mail size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">Roundups</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  A weekly email with featured creators, news, events, and
                  opportunities from across the North East.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Handshake size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">Referrals</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  A clearer way for NAMI to remember who does what, where they
                  are based, and who to recommend.
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
            className="mb-14 max-w-2xl"
          >
            <motion.span className="mono-label mb-5 block" variants={fadeUp}>
              How I think
            </motion.span>
            <motion.h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[0.98] tracking-tight md:leading-[0.96]"
              variants={fadeUp}
            >
              Three principles <span className="text-gradient">I work by</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stageFast}
            className="grid gap-6 md:grid-cols-3 md:gap-8"
          >
            {values.map((value, i) => (
              <motion.div key={value.title} variants={cardIn}>
                <SpotlightCard
                  tilt={4}
                  className="glass-refractive glass-refractive--hover h-full rounded-2xl"
                >
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="font-mono text-sm text-accent">
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
                      {value.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-fg-muted">
                      {value.body}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Founder note */}
      <section className="container-shell py-24 md:py-32 border-t border-line">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16 lg:gap-20"
        >
          <motion.div variants={fadeUp}>
            <div className="glass-refractive relative aspect-3/4 overflow-hidden rounded-2xl">
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
            <p className="mono-label">04 / The founder</p>
            <p className="text-2xl font-medium leading-[1.03] tracking-tight md:text-3xl">
              Hi, I'm <span className="text-gradient">Joe Wilson</span>
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I started NAMI Creative because I got tired of seeing good ideas
              slowed down by messy processes, unclear words, or five different
              tools that did not quite talk to each other. I like figuring out
              the idea, then getting it live.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Twenty years in brand building and design sit behind that. I held
              a head-of-department role at the UK&apos;s leading energy
              consultants&apos; trade body, building a brand with enough weight
              to earn a seat in Westminster, and I&apos;ve been featured on BBC
              Radio for the Nami Up North project.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I am a proud dad, easy to get along with, and I love nothing more
              than seeing people around me win. I am always open to good
              conversations, interesting projects, and people doing things
              properly.
            </p>
            <dl className="grid gap-8 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <dt className="mono-label">Experience</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  20 years
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  Brand building + design
                </p>
              </div>
              <div>
                <dt className="mono-label">Leadership</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  Head of Dept.
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  UK&apos;s leading energy consultants&apos; trade body
                </p>
              </div>
              <div>
                <dt className="mono-label">Featured</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  BBC Radio
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  Nami Up North project
                </p>
              </div>
            </dl>

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
      </section>
    </>
  );
}
