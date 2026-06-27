import { motion } from 'framer-motion'
import { certifications } from '../data/certifications'

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// ── Animated visuals ─────────────────────────────────────────────
function ScatterAnim({ accent }) {
  const pts = [
    [8,42],[18,16],[30,54],[42,22],[54,48],[64,12],[74,38],[84,52],[92,26],[48,32]
  ]
  const lines = [[0,3],[1,5],[2,7],[3,8],[4,6]]
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke={accent} strokeWidth="0.4" opacity="0.18" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.3}
          fill={accent} opacity={0.45 + (i % 4) * 0.1}
          className="anim-cert-float"
          style={{ animationDelay: `${i * 0.19}s` }} />
      ))}
    </svg>
  )
}

function PulseAnim({ accent }) {
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {[14, 22, 30].map((r, i) => (
        <circle key={i} cx={50} cy={30} r={r} fill="none"
          stroke={accent} strokeWidth="0.7"
          className="anim-cert-pulse"
          style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <circle cx={50} cy={30} r={3.5} fill={accent} opacity={0.9} />
      <circle cx={50} cy={30} r={1.5} fill="var(--bg-primary,#000)" />
    </svg>
  )
}

function WaveAnim({ accent }) {
  const xs = [8, 20, 32, 44, 56, 68, 80, 92]
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      <polyline
        points={xs.map(x => `${x},30`).join(' ')}
        fill="none" stroke={accent} strokeWidth="0.3" opacity="0.2" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={30} r={1.5}
          fill={accent} opacity={0.65}
          className="anim-cert-wave"
          style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </svg>
  )
}

function BarsAnim({ accent }) {
  const config = [
    [9,22],[20,38],[31,14],[42,46],[53,30],[64,42],[75,18],[86,34]
  ]
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {config.map(([x, h], i) => (
        <rect key={i} x={x - 3} y={55 - h} width={6} height={h}
          fill={accent} opacity={0.45 + (i % 3) * 0.12}
          rx="1"
          className="anim-cert-bar"
          style={{ animationDelay: `${i * 0.14}s`, transformOrigin: `${x}px 55px` }} />
      ))}
    </svg>
  )
}

function GridAnim({ accent }) {
  const dots = []
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 9; col++)
      dots.push([col * 10 + 8, row * 18 + 12])
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3}
          fill={accent} opacity={0.3}
          className="anim-cert-grid"
          style={{ animationDelay: `${(i * 0.09) % 2.2}s` }} />
      ))}
    </svg>
  )
}

// ── Security Shield (CompTIA Security+) — reduced height ──────────
function ShieldAnim({ accent }) {
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {[20, 27].map((r, i) => (
        <circle key={i} cx={50} cy={27} r={r} fill="none"
          stroke={accent} strokeWidth="0.35" opacity="0.18"
          className="anim-cert-pulse"
          style={{ animationDelay: `${i * 0.75}s` }} />
      ))}
      {[[16,6],[84,6],[16,54],[84,54]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={1}
          fill={accent} opacity={0.22}
          className="anim-cert-grid"
          style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      <path d="M50,10 L61,14 L61,29 C61,37 56,43 50,45 C44,43 39,37 39,29 L39,14 Z"
        fill="none" stroke={accent} strokeWidth="1.4" strokeLinejoin="round"
        className="anim-shield-glow" />
      <line x1={41} y1={27} x2={59} y2={27}
        stroke={accent} strokeWidth="0.65" opacity="0.55"
        className="anim-shield-scan" />
      <path d="M43,27 L48,33 L58,20"
        fill="none" stroke={accent} strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.95" />
    </svg>
  )
}

// ── Docker Whale (Moby Dick style) ───────────────────────────────
function DockerAnim({ accent }) {
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {/* Static water line */}
      <path d="M5,55 Q18,52 30,55 Q42,58 54,55 Q66,52 78,55 Q88,53 96,55"
        fill="none" stroke={accent} strokeWidth="0.7" opacity="0.28" />
      {/* Whale + containers bob together */}
      <g className="anim-docker-bob">
        {/* Body: flat back at y=30, rounded head left, tail junction right */}
        <path d="M14,42 C13,34 18,29 26,30 L64,30 C70,30 73,35 73,42 C73,49 70,53 64,53 L26,53 C18,53 13,49 14,42 Z"
          fill="none" stroke={accent} strokeWidth="1.4" strokeLinejoin="round" />
        {/* Upper tail fin */}
        <path d="M73,37 C77,29 80,22 82,17 C79,23 75,32 73,39 Z"
          fill={accent} opacity="0.65" />
        {/* Lower tail fin */}
        <path d="M73,45 C77,51 80,57 82,59 C79,55 75,48 73,43 Z"
          fill={accent} opacity="0.65" />
        {/* Eye */}
        <circle cx={22} cy={42} r={1.8} fill={accent} opacity={0.95} />
        {/* Bottom flipper */}
        <path d="M32,53 Q36,57 44,56 Q41,53 32,53 Z" fill={accent} opacity={0.3} />
        {/* Containers row 1 */}
        <rect x={36} y={18} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" />
        <rect x={43} y={18} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" />
        <rect x={50} y={18} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" />
        {/* Containers row 2 (bottom edge sits on whale back y=30) */}
        <rect x={36} y={24} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" opacity="0.8" />
        <rect x={43} y={24} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" opacity="0.8" />
        <rect x={50} y={24} width={6} height={6} rx={0.8} fill="none" stroke={accent} strokeWidth="1" opacity="0.8" />
      </g>
      {/* Water spout from blowhole */}
      <path d="M28,30 Q26,22 28,15 Q30,9 27,4"
        fill="none" stroke={accent} strokeWidth="0.9" opacity="0.55"
        className="anim-cert-wave" />
    </svg>
  )
}

// ── Radar Sweep (ISO 27001) ──────────────────────────────────────
function RadarAnim({ accent }) {
  const blips = [
    { cx: 6,   cy: -16, delay: 0.8 },
    { cx: 16,  cy:   5, delay: 2.1 },
    { cx: -8,  cy:  10, delay: 1.5 },
    { cx: -18, cy:  -6, delay: 3.2 },
  ]
  return (
    <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="cert3-anim-svg">
      {/* Concentric range rings */}
      {[8, 16, 24].map((r, i) => (
        <circle key={i} cx={50} cy={30} r={r}
          fill="none" stroke={accent} strokeWidth="0.5" opacity={0.3 - i * 0.05} />
      ))}
      {/* Crosshair */}
      <line x1={50} y1={6}  x2={50} y2={54} stroke={accent} strokeWidth="0.4" opacity="0.18" />
      <line x1={26} y1={30} x2={74} y2={30} stroke={accent} strokeWidth="0.4" opacity="0.18" />
      {/* Compass tick dots */}
      {[[50,7],[50,53],[27,30],[73,30]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill={accent} opacity={0.35} />
      ))}
      {/* Rotating sweep — translate-to-origin trick for precise rotation */}
      <g transform="translate(50, 30)">
        <g className="anim-radar-spin">
          <path d="M0,0 L0,-24 A24,24 0 0,1 7.4,-22.8 Z"
            fill={accent} fillOpacity="0.1" stroke="none" />
          <line x1={0} y1={0} x2={0} y2={-24}
            stroke={accent} strokeWidth="1.1" opacity="0.85" strokeLinecap="round" />
        </g>
      </g>
      {/* Radar blips (absolute coords = center + offset) */}
      {blips.map((b, i) => (
        <circle key={i} cx={50 + b.cx} cy={30 + b.cy} r={2.2}
          fill={accent}
          className="anim-radar-blip"
          style={{ animationDelay: `${b.delay}s` }} />
      ))}
      {/* Center dot */}
      <circle cx={50} cy={30} r={1.5} fill={accent} opacity={0.8} />
    </svg>
  )
}

function AnimVis({ type }) {
  const accent = 'var(--accent)'
  switch (type) {
    case 'shield':  return <ShieldAnim  accent={accent} />
    case 'docker':  return <DockerAnim  accent={accent} />
    case 'radar':   return <RadarAnim   accent={accent} />
    case 'scatter': return <ScatterAnim accent={accent} />
    case 'pulse':   return <PulseAnim   accent={accent} />
    case 'wave':    return <WaveAnim    accent={accent} />
    case 'bars':    return <BarsAnim    accent={accent} />
    case 'grid':    return <GridAnim    accent={accent} />
    default:        return <ScatterAnim accent={accent} />
  }
}

// ── Card ─────────────────────────────────────────────────────────
function CertCard({ cert, num }) {
  return (
    <motion.div className="cert3-card" variants={cardVariants}>
      <div className="cert3-anim-wrap">
        <AnimVis type={cert.anim} />
      </div>
      <div className="cert3-body">
        <div className="cert3-meta">
          <span className="cert3-label">
            <span className="cert3-dot" />
            {cert.label}
          </span>
          <span className="cert3-num">{String(num).padStart(2, '0')}</span>
        </div>
        <div className="cert3-name">{cert.name}</div>
        <div className="cert3-desc">{cert.description}</div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────
export default function Certifications() {
  const row1 = certifications.slice(0, 4)
  const row23 = certifications.slice(4)

  return (
    <section className="section section-alt" id="certifications">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">04</span>
          <h2 className="section-title" data-text="Certifications & Training">Certifications & Training</h2>
        </div>
        <motion.div
          className="cert3-grid cert3-cols-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {row1.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} num={i + 1} />
          ))}
        </motion.div>
        <motion.div
          className="cert3-grid cert3-cols-3 cert3-grid-no-top"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {row23.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} num={i + 5} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
