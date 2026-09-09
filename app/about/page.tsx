"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Handshake, Mail, Users } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/socials";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { SpotlightCard } from "@/components/motion/spotlight-card";
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
            Good work should not{" "}
            <span className="text-gradient sm:block">go unnoticed</span>
          </>
        }
        lead="I’m Joe Wilson. I help North East businesses explain what they do, look the part and make it easier for customers to choose them. I also run the NAMI Creative Network to help local creative people get found and hired."
      />

      {/* Story */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p className="mono-label md:mt-2" variants={fadeUp}>
            01 / The story
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="type-subsection-title">
              NAMI started with a simple frustration: too much good work gets overlooked.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I kept meeting people who were brilliant at what they did, but
              their brand, website or content did not show it. Customers could
              not quickly understand why they should choose them.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              That is the part I help fix. I bring the words, design, website,
              content and repetitive admin together so the business is easier
              to understand and easier to run.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              The Network grew from the same idea. There are talented people
              across the North East who deserve a proper place to be found.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* North East */}
      <section className="relative isolate overflow-hidden border-y border-line py-24 md:py-32">
        <ParallaxBackdrop
          src="/images/north-east/4.jpg"
          position="center 48%"
          overlay={0.84}
        />
        <div className="container-shell relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p className="mono-label md:mt-2" variants={fadeUp}>
              02 / The North East
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-6">
              <p className="type-subsection-title">
                I want more North East people to get the attention their work deserves.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                I was born and raised in Newcastle. I know how much talent is
                here, from artists and makers to freelancers, shops and growing
                businesses. Plenty of them are doing excellent work without
                getting enough attention for it.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                My client work helps businesses present themselves clearly and
                turn more interest into enquiries. The Network helps local
                people get discovered, featured and recommended.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                Both sides support each other. Local businesses need good people
                to work with, and local creatives need more chances to be seen
                and paid for what they do.
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
                and make introductions when somebody asks who I would recommend.
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
                  Work with me
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
                <h3 className="type-card-title mt-5">Visibility</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Member features and posts that put more local work in front
                  of the right people.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Mail size={22} className="text-accent" aria-hidden />
                <h3 className="type-card-title mt-5">Useful updates</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Emails with local people to follow, events worth knowing
                  about and opportunities for members.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Handshake size={22} className="text-accent" aria-hidden />
                <h3 className="type-card-title mt-5">Introductions</h3>
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
              <motion.div key={value.title} variants={cardIn}>
                <SpotlightCard
                  tilt={4}
                  className="glass-refractive glass-refractive--hover h-full rounded-2xl"
                >
                  <div className="relative z-10 p-8 md:p-10">
                    <h3 className="type-card-title">
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
      <section className="relative isolate overflow-hidden border-t border-line py-24 md:py-32">
        <ParallaxBackdrop
          src="/images/north-east/2.jpg"
          position="center 48%"
          overlay={0.89}
        />
        <div className="container-shell relative z-10">
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
            <p className="type-subsection-title">
              I’m <span className="text-gradient">Joe Wilson</span>
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I started NAMI because I kept seeing good businesses held back by
              unclear words, disjointed marketing and admin that took up too
              much of the week. I like finding the problem, fixing it and
              leaving people with something they can use.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I have spent 20 years working in branding and design. I previously
              led a department at the UK&apos;s leading trade body for energy
              consultants, where I helped build a brand that was represented in
              Westminster. BBC Radio has also featured my Nami Up North project.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I am a proud dad and a Newcastle lad. I care about doing the work
              properly, being straightforward with people and helping good ideas
              make it out into the world.
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
        </div>
      </section>
    </>
  );
}
