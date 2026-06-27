import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef(null)
  const dotRef = useRef(null)
  const pos = useRef({ x: -200, y: -200 })
  const raf = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    const dot = dotRef.current
    if (!glow || !dot) return

    // No cursor on touch/pointer-coarse devices (mobile & tablet)
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const lerp = (a, b, t) => a + (b - a) * t

    let cx = -200, cy = -200

    const tick = () => {
      cx = lerp(cx, pos.current.x, 0.12)
      cy = lerp(cy, pos.current.y, 0.12)
      glow.style.transform = `translate(${cx}px, ${cy}px)`
      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      raf.current = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Lagging ambient glow */}
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      {/* Precise dot */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
