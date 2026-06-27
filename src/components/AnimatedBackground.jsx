import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 100
const CONNECTION_DIST = 140
const FOV = 500

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const mouse = { x: null, y: null }

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent ? parent.offsetWidth : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
    }
    resize()

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1800,
      y: (Math.random() - 0.5) * 1200,
      z: Math.random() * 700 + 100,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      vz: -(Math.random() * 0.4 + 0.1),
      hue: Math.random() > 0.55 ? 201 : 160,
    }))

    const project = (x, y, z) => {
      const scale = FOV / (FOV + z)
      return {
        sx: x * scale + canvas.width / 2,
        sy: y * scale + canvas.height / 2,
        scale,
      }
    }

    const resetParticle = (p) => {
      p.z = 750
      p.x = (Math.random() - 0.5) * 1800
      p.y = (Math.random() - 0.5) * 1200
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.z += p.vz
        p.x += p.vx
        p.y += p.vy

        if (mouse.x !== null) {
          const dx = mouse.x - canvas.width / 2
          const dy = mouse.y - canvas.height / 2
          p.x += dx * 0.000015
          p.y += dy * 0.000015
        }

        if (p.z < 1) resetParticle(p)
      })

      const sorted = [...particles].sort((a, b) => b.z - a.z)
      const projected = sorted.map(p => ({ p, ...project(p.x, p.y, p.z) }))

      // connections
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i]
        if (a.sx < -60 || a.sx > canvas.width + 60 || a.sy < -60 || a.sy > canvas.height + 60) continue
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18 * Math.min(a.scale, b.scale)
            ctx.beginPath()
            ctx.moveTo(a.sx, a.sy)
            ctx.lineTo(b.sx, b.sy)
            ctx.strokeStyle = `rgba(14,165,233,${alpha * 1.4})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      // particles
      projected.forEach(({ p, sx, sy, scale }) => {
        if (sx < -8 || sx > canvas.width + 8 || sy < -8 || sy > canvas.height + 8) return
        const r = scale * 2.8
        const alpha = Math.min(scale * 0.9, 0.85)

        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4)
        grd.addColorStop(0, `hsla(${p.hue},80%,65%,${alpha * 0.35})`)
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(sx, sy, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,68%,${alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = null; mouse.y = null }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
          opacity: 0.75,
        }}
      />
      <div className="grid-overlay" />
    </>
  )
}
