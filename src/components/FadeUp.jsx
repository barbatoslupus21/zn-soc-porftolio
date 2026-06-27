import { motion } from 'framer-motion'

export default function FadeUp({ children, delay = 0, className, as: Tag = 'div' }) {
  const MotionTag = motion[Tag] ?? motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
