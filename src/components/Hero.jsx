import { useState, useEffect } from 'react'
import AnimatedBackground from './AnimatedBackground'

const cyclingWords = ['HUNTS', 'DETECTS', 'RESPONDS', 'ANALYZES', 'DEFENDS']

// SVG icons — 16×16 viewBox, stroke-based
const Icon = ({ path, path2 }) => (
  <svg
    width="13" height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <path d={path} />
    {path2 && <path d={path2} />}
  </svg>
)

const tickerItems = [
  // ── Tools ──────────────────────────────────────────────
  {
    label: 'Wireshark',
    icon: <Icon path="M1 8c1.5-3.5 4-5 7-5s5.5 1.5 7 5c-1.5 3.5-4 5-7 5S2.5 11.5 1 8z" path2="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />,
  },
  {
    label: 'Volatility 3',
    icon: <Icon path="M3 4h10v8H3z" path2="M3 8h10M7 4v8M9 4v8" />,
  },
  {
    label: 'Splunk',
    icon: <Icon path="M6.5 11.5L9.5 11.5 M11.5 11.5L14 14" path2="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3z" />,
  },
  {
    label: 'Snort IDS',
    icon: <Icon path="M8 2L3.5 4.5V8c0 3.5 2.5 5.5 4.5 6 2-.5 4.5-2.5 4.5-6V4.5L8 2z" path2="M5.5 8.5l1.5 1.5 3.5-3.5" />,
  },
  {
    label: 'CyberChef',
    icon: <Icon path="M3 6h10M3 10h10M6 3v10M10 3v10" />,
  },
  {
    label: 'VirusTotal',
    icon: <Icon path="M11.5 11.5L14 14M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3z" path2="M6 8l1.5 1.5 2.5-3" />,
  },
  {
    label: 'Velociraptor',
    icon: <Icon path="M9 2L5.5 8.5h4.5L7 14l7.5-8.5H9.5z" />,
  },
  {
    label: 'Sysmon',
    icon: <Icon path="M2 4h12v7H2z" path2="M5 11v2M11 11v2M4 13h8M8 7V6M8 9v.5" />,
  },
  {
    label: 'tshark',
    icon: <Icon path="M3 3h10v10H3z" path2="M6 7l2 2-2 2M10 11h2" />,
  },
  {
    label: 'tcpdump',
    icon: <Icon path="M3 4h10v8H3z" path2="M5 8h6M5 6h3M5 10h4" />,
  },
  {
    label: 'MISP',
    icon: <Icon path="M8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" path2="M3 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM13 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 6v4M8 10l-3.5 1.5M8 10l3.5 1.5" />,
  },
  {
    label: 'Shodan',
    icon: <Icon path="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" path2="M8 5a3 3 0 0 1 3 3M8 8m-1 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM8 2v1.5M13.5 6l-1.2.7" />,
  },
  {
    label: 'AbuseIPDB',
    icon: <Icon path="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" path2="M4.5 4.5l7 7" />,
  },
  {
    label: 'Brim',
    icon: <Icon path="M3 4h10l-3.5 4.5v4l-3-1.5V8.5z" />,
  },
  {
    label: 'olevba',
    icon: <Icon path="M5 4L2.5 8 5 12" path2="M11 4l2.5 4-2.5 4M9.5 3.5l-3 9" />,
  },
  {
    label: 'NetworkMiner',
    icon: <Icon path="M3 5h4v4H3z" path2="M9 5h4v4H9zM5 9v3h6v-3M8 12v2" />,
  },
  {
    label: 'REMnux',
    icon: <Icon path="M2 6h12v7H2z" path2="M5 6V4h6v2M8 9v2M6 11h4" />,
  },
  {
    label: 'Timeline Explorer',
    icon: <Icon path="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" path2="M8 5v3.5l2.5 2" />,
  },
  {
    label: 'Censys',
    icon: <Icon path="M2 8h12M8 2v12" path2="M4.5 4.5l7 7M11.5 4.5l-7 7" />,
  },
  {
    label: 'Cisco Talos',
    icon: <Icon path="M8 2L3 4.5V9c0 3.5 3 5.5 5 6 2-.5 5-2.5 5-6V4.5L8 2z" path2="M8 6v3M8 11v.5" />,
  },

  // ── Skills / Techniques ────────────────────────────────
  {
    label: 'PCAP Analysis',
    icon: <Icon path="M2 5h3v6H2zM6 5h3v6H6zM11 5h3v6h-3z" path2="M2 8h12" />,
  },
  {
    label: 'Memory Forensics',
    icon: <Icon path="M4 8a4 4 0 0 1 8 0" path2="M4 8c0 2.5 1.5 4.5 4 5 2.5-.5 4-2.5 4-5M8 13v1.5M6 7.5V6M10 7.5V6" />,
  },
  {
    label: 'Threat Hunting',
    icon: <Icon path="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" path2="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M8 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />,
  },
  {
    label: 'IOC Extraction',
    icon: <Icon path="M3 8a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" path2="M8 8h6M12 6v4M14 6v4" />,
  },
  {
    label: 'Incident Response',
    icon: <Icon path="M8 2L2 13.5h12L8 2z" path2="M8 7v3.5M8 12.5v.5" />,
  },
  {
    label: 'MITRE ATT&CK',
    icon: <Icon path="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />,
  },
  {
    label: 'Blue Team OPS',
    icon: <Icon path="M8 2L3 4v4c0 3.5 3 5.5 5 6 2-.5 5-2.5 5-6V4L8 2z" path2="M5.5 8l1.5 2 3.5-4" />,
  },
  {
    label: 'DNS Tunneling',
    icon: <Icon path="M3 5h10v6H3z" path2="M6 5V3.5h4V5M6 11v1.5h4V11M8 5v6" />,
  },
  {
    label: 'Python Automation',
    icon: <Icon path="M6 2.5C4 2.5 3 4 3 5.5S4 8 6 8h4c2 0 3 1.5 3 3S12 14 10 14" path2="M10 2.5c2 0 3 1.5 3 3S12 8 10 8H6c-2 0-3 1.5-3 3" />,
  },
  {
    label: '10+ INVESTIGATIONS',
    icon: <Icon path="M8 2l1.5 3.1L13 5.6l-2.5 2.4.6 3.4L8 9.8l-3.1 1.6.6-3.4L3 5.6l3.5-.5z" />,
  },
]

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % cyclingWords.length)
        setVisible(true)
      }, 350)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero" id="hero">
      <AnimatedBackground />
      <div className="hero-content">
        <div className="hero-status">
          <span className="status-dot" />
          System_Status: Available for Hire
        </div>

        <h1 className="hero-display">
          <span className="hero-line hero-line--white">ANALYST THAT</span>
          <span className={`hero-line hero-line--accent hero-line--cycling${visible ? ' word-visible' : ' word-hidden'}`}>
            {cyclingWords[wordIndex]}
          </span>
          <span className="hero-line hero-line--white">THREATS</span>
        </h1>

        <p className="hero-name-tag">ZEN MIER · SOC ANALYST · BLUE TEAM</p>

        <p className="hero-tagline">
          Protecting systems through threat detection, incident response, and network
          forensics — combining software engineering with hands-on security operations.
        </p>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            VIEW PROJECTS →
          </a>
          <a href="#certifications" className="btn btn-outline">
            CERTIFICATIONS →
          </a>
        </div>

      </div>

      <div className="hero-ticker-wrap">
        <div className="hero-ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="ticker-item">
                {item.icon}
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
