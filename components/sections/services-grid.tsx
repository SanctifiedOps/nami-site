"use client";

import { motion } from "motion/react";
import { services } from "@/lib/content/services";
import { stageFast } from "@/lib/motion";
import { ServiceCard } from "./service-card";

export function ServicesGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
    >
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </motion.div>
  );
}
