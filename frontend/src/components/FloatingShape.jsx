import { motion as Motion } from 'framer-motion'

const FloatingShape = ( { color, size, delay } ) => {
  return (
    <Motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top: "10%", left: "10%" }}
      animate={{ y: ["0%", "50%", "100%", "0%"], x: ["0%", "350%", "150%", "0%"], rotate: ["0deg", "180deg", "360deg"], scale: ["1", "1.2", "0.9", "1"] }}
      transition={{ duration: 20, ease: "linear", repeat: Infinity, delay }}
      aria-hidden="true"
    />
  )
}

export default FloatingShape