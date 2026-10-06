"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content/services";
import { cardIn, stageFast } from "@/lib/motion";
import { ServiceCard } from "./service-card";

export function ServicesGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
      <ServicesCtaCard />
    </motion.div>
  );
}

function ServicesCtaCard() {
  return (
    <motion.div variants={cardIn} className="group h-full">
      <Link
        href="/contact"
        className="flex min-h-72 h-full flex-col border border-accent/45 bg-accent p-7 text-white transition-colors hover:bg-accent-soft md:min-h-80 md:p-9"
      >
        <p className="text-sm font-medium text-white/75">Not sure where to begin?</p>
        <h3 className="mt-8 max-w-sm text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">
          Start with what is getting in the way
        </h3>
        <p className="mt-4 max-w-sm leading-[1.5] text-white/82">
          Tell me what feels messy, slow or unclear. I&apos;ll help you work out what needs fixing first.
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">
          Tell me about it
          <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
