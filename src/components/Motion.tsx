"use client";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function Reveal({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      tabIndex={id ? -1 : undefined}
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduce ? 0 : 0.55 }}
    >
      <div className={reduce ? "" : "reveal-content"}>{children}</div>
    </motion.section>
  );
}

export function JourneyHeader({
  name,
  level,
  rank,
  paused = false,
}: {
  name: string;
  level: number;
  rank: string;
  paused?: boolean;
}) {
  const target = useRef<HTMLElement>(null);
  const systemReduce = useReducedMotion();
  const reduce = systemReduce || paused;
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  return (
    <section className="journey-header" ref={target} aria-labelledby="journey-title">
      <motion.div
        className="journey-image"
        aria-hidden="true"
        style={{ y: reduce ? 0 : y, scale: reduce ? 1 : scale }}
      />
      <div className="journey-content">
        <span className="eyebrow">YOUR LEARNING, CONNECTED</span>
        <h1 id="journey-title">
          Keep building, <em>{name}.</em>
        </h1>
        <p>Every small step adds up. Here’s the bigger picture.</p>
        <a href="#skills" className="journey-rank">
          <span className="rank-mini">{level}</span>
          <span>
            {rank}
            <span className="rank-mini-label">Explore your strengths ↗</span>
          </span>
        </a>
      </div>
      <span className="journey-index">THE JOURNEY / 01</span>
    </section>
  );
}
