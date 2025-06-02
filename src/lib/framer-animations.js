export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const cardHover = {
  y: -5,
  boxShadow:
    '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

export const sectionFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const tocItemVariants = {
  initial: { opacity: 0, x: -15 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
};
