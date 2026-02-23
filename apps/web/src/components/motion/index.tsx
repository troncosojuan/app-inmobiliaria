"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}

interface FadeUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

export function FadeUp({ children, delay = 0, ...props }: FadeUpProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={fadeUp}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: EASE }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function FadeIn({ children, delay = 0, ...props }: FadeUpProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={fadeIn}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : delay }}
      {...props}
    >
      {children}
    </m.div>
  );
}

interface StaggerListProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  slow?: boolean;
}

export function StaggerList({ children, slow = false, ...props }: StaggerListProps) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={slow ? staggerContainerSlow : staggerContainer}
      {...props}
      style={{ touchAction: "pan-y", ...props.style }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <m.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: EASE }}
      {...props}
      style={{ touchAction: "pan-y", ...props.style }}
    >
      {children}
    </m.div>
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease: EASE }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedCounter({ value, duration = 1.5, className, suffix = "", prefix = "", decimals = 0 }: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => {
    if (decimals > 0) return `${prefix}${latest.toFixed(decimals)}${suffix}`;
    return `${prefix}${Math.round(latest).toLocaleString("es-AR")}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [motionValue, value, duration]);

  return <m.span ref={nodeRef} className={className}>{display}</m.span>;
}

export { m };
