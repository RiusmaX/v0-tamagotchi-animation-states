"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface XPAnimationProps {
  trigger: number
  xpGained: number
}

export function XPAnimation({ trigger, xpGained }: XPAnimationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger > 0) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white font-bold text-lg tracking-wider">
            +{xpGained} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
