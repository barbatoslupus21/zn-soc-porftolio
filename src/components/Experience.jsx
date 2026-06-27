const experiences = [
  {
    id: 'soc-training',
    category: 'SELF-STUDY',
    title: 'SOC Analyst Studies',
    company: 'TryHackMe · CompTIA',
    date: 'Jan 2026 – Present',
    description: 'Actively pursuing CompTIA Security+ (SY0-701) and TryHackMe SOC Level 1 certification. Conducted 8+ hands-on investigations with full technical reports, IOC tables, and MITRE ATT&CK mapping using Volatility 3, Wireshark, Snort, and Splunk.',
    tags: ['CompTIA Security+', 'SOC Operations', 'SIEM', 'Wireshark', 'Splunk', 'MITRE ATT&CK'],
    metric: 'SEC+',
    metricLabel: 'COMPTIA · SY0-701',
  },
  {
    id: 'ryonan',
    category: 'EMPLOYMENT',
    title: 'RPA & Web Developer',
    company: 'Ryonan Electric Philippines · Asst. Supervisor',
    date: 'Jan 2023 – Present',
    description: 'Developed RPA workflows and 3 enterprise web applications processing 4,000+ daily transactions with 99.9% uptime. Built real-time production monitoring for 12 lines with RBAC, saving 35+ hours weekly through automation.',
    tags: ['RPA', 'Python', 'Django', 'Web Development', 'Docker', 'CI/CD', 'Linux'],
    metric: '35H+',
    metricLabel: 'SAVED WEEKLY',
  },
  {
    id: 'freelance',
    category: 'FREELANCE',
    title: 'Software Developer',
    company: 'Self-Employed',
    date: '2024 – Present',
    description: 'Built AI automation pipelines for email triage, document processing, and threat enrichment. Developed RAG-powered knowledge base assistants and security-conscious web applications with audit logging and RBAC.',
    tags: ['AI Automation', 'Python', 'LLM', 'RAG', 'API Integration'],
    metric: 'AI',
    metricLabel: 'AUTOMATION',
  },
  {
    id: 'education',
    category: 'EDUCATION',
    title: 'BS Computer Engineering',
    company: 'Trimex Colleges',
    date: 'Graduated Jun 2024',
    description: 'Bachelor\'s degree in Computer Engineering. Completed AWS cloud architecture projects, VPC deployments, and serverless computing. Earned certifications in Security+, ISO 27001, Python, Docker, and Linux during studies.',
    tags: ['CompTIA Security+', 'ISO 27001', 'AWS', 'Six Sigma'],
    metric: 'B.S.',
    metricLabel: 'COMP. ENGINEERING',
  },
]

import { motion } from 'framer-motion'

const rowVariants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">05</span>
          <h2 className="section-title" data-text="Experience & Education">Experience & Education</h2>
        </div>
        <div className="exp2-table">
          {experiences.map((exp, i) => (
            <motion.div
              className="exp2-row"
              key={exp.id}
              variants={rowVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="exp2-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="exp2-info">
                <div className="exp2-category">
                  <span className="exp2-dot" />
                  {exp.category}
                </div>
                <div className="exp2-title">{exp.title}</div>
              </div>
              <div className="exp2-desc">
                <div className="exp2-desc-header">
                  <div className="exp2-company">{exp.company}</div>
                  <div className="exp2-date">{exp.date}</div>
                </div>
                <p className="exp2-desc-text">{exp.description}</p>
                <div className="exp2-tags">
                  {exp.tags.map(t => <span key={t} className="exp2-tag">{t}</span>)}
                </div>
              </div>
              <div className="exp2-metric">
                <div className="exp2-metric-val">{exp.metric}</div>
                <div className="exp2-metric-label">{exp.metricLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
