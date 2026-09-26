'use client';

import type { ReactNode } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';

interface MotionProviderProperties {
  readonly children: ReactNode;
}

interface RevealProperties {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly distance?: number;
}

interface HeroRevealProperties {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

export function MotionProvider({ children }: MotionProviderProperties) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </MotionConfig>
  );
}

export function Reveal({ children, className, delay = 0, distance = 24 }: RevealProperties) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reducedMotion ? 0 : 0.52,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroReveal({ children, className, delay = 0 }: HeroRevealProperties) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.9,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionLine({ active = false }: { readonly active?: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="motion-line"
      initial={false}
      animate={{ scaleX: active ? 1 : 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}
