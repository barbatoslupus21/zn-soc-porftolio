import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { num: 23,   fmt: n => `${n}+`,                          label: 'Projects Built',   desc: 'web, desktop & AI apps'     },
  { num: 10,   fmt: n => `${n}+`,                          label: 'Investigations',   desc: 'documented lab cases'       },
  { num: 20,   fmt: n => `${n}+`,                          label: 'Security Tools',   desc: 'hands-on proficiency'       },
  { num: 1000, fmt: n => `${n}+`,                          label: 'Users Served',     desc: 'across production systems'  },
]

function AnimatedStat({ num, fmt, label, desc }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const duration = 3200
        const origin = performance.now()
        const tick = (now) => {
          const t = Math.min((now - origin) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
          setCount(Math.round(eased * num))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [num])

  return (
    <div className="about-stat" ref={ref}>
      <span className="stat-number">{fmt(count)}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-desc">{desc}</span>
    </div>
  )
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">01</span>
          <h2 className="section-title" data-text="About Me">About Me</h2>
          <p className="section-desc">
            SOC Analyst and Blue Team practitioner with software engineering foundations.
          </p>
        </div>
        <motion.div
          className="about-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="about-content-right">
            <span className="about-label">About Me</span>
            <h3 className="about-headline">
              Cybersecurity Analyst with Software Engineering Foundations
            </h3>
            <p className="about-description">
              I'm a SOC Analyst and Blue Team practitioner with 2.5+ years of enterprise
              software engineering experience. I've completed comprehensive hands-on security
              operations training including incident response investigations, network forensics,
              memory analysis, and threat intelligence — all documented with detailed technical
              reports. My software background gives me a unique edge: I can read attacker code,
              build detection tooling, and automate SOC workflows.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h4>Threat Detection & Response</h4>
                  <p>Incident response, Sysmon analysis, PCAP forensics, and MITRE ATT&CK mapping</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <h4>Network & Memory Forensics</h4>
                  <p>Wireshark, Volatility 3, DNS analysis, PCAP investigation, and IOC extraction</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h4>Software Engineering</h4>
                  <p>Python, Django, AI automation, and AWS cloud — enterprise-grade at 99.5% uptime</p>
                </div>
              </div>
            </div>

            <div className="about-stats">
              {STATS.map(s => (
                <AnimatedStat key={s.label} {...s} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
