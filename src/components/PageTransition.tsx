import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// Premium easing curve — Apple-style deceleration
const ease = [0.32, 0.72, 0, 1] as const;

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.35, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;

// Shared motion config for consistency across all components
export const motionConfig = {
  ease,
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    page: 0.35,
  },
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  // Stagger children with delay
  stagger: (index: number, base = 0.04) => ({
    delay: index * base,
    duration: 0.4,
    ease,
  }),
};

// Reusable animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.35, ease },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.25, ease },
};

// Sheet / bottom-sheet variant
export const sheetUp = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: { duration: 0.4, ease },
};

// Success confirmation
export const successPop = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.6,
  },
};

export { AnimatePresence };
