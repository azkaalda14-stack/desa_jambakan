"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface RevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export default function Reveal({
  children,
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  className,
  direction = "up"
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, once])

  const directionClass = {
    up: "translate-y-6",
    down: "-translate-y-6",
    left: "translate-x-6",
    right: "-translate-x-6",
  }[direction]

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        visible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 " + directionClass,
        className
      )}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}