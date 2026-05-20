import type { Variants } from "motion/react";

// Easing constants (animated-frontend-design motion-system). Do not inline raw beziers.
export const ease = [0.22, 1, 0.36, 1] as const;
export const easeSnap = [0.16, 1, 0.3, 1] as const;

// Spring presets for physical-feeling interactions.
export const springCard = { type: "spring", stiffness: 300, damping: 30 } as const;
export const springButton = { type: "spring", stiffness: 400, damping: 25 } as const;
export const springMagnetic = { stiffness: 150, damping: 15, mass: 0.1 } as const;

// Primary reveal: fade + small translate. Reserve y >= 16 for cards/sections.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// Stagger containers.
export const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

export const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export const gridStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// whileInView convention: trigger once, slightly before fully in view.
export const inViewOnce = { once: true, margin: "-80px" } as const;
