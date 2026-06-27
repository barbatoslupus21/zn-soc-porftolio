import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { securitySkills, devSkills } from '../data/skills'
import TiltCard from './TiltCard'

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const categoryIcons = {
  siem: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
  network: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>,
  threat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  dfir: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  detection: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
  framework: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
}

const devCategoryIcons = {
  'AI & Automation': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  'Development': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  'Infrastructure': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /></svg>,
  'Security Architecture': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('security')

  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">02</span>
          <h2 className="section-title" data-text="Skills & Expertise">Skills & Expertise</h2>
        </div>

        <div className="skills-tabs">
          <button className={`skills-tab${activeTab === 'security' ? ' active' : ''}`} onClick={() => setActiveTab('security')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Cybersecurity Skills
            </span>
          </button>
          <button className={`skills-tab${activeTab === 'dev' ? ' active' : ''}`} onClick={() => setActiveTab('dev')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              Development & Infrastructure
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'security' && (
            <motion.div
              key="security"
              className="security-skills-grid"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
            >
              {securitySkills.map(cat => (
                <motion.div key={cat.category} variants={cardVariants}>
                  <TiltCard className="skill-category-card" intensity={8}>
                    <div className="skill-cat-header">
                      <div className="skill-cat-icon">{categoryIcons[cat.icon]}</div>
                      <span className="skill-cat-title">{cat.category}</span>
                    </div>
                    <div className="skill-tags">
                      {cat.skills.map(skill => (
                        <span className="skill-tag" key={skill}>{skill}</span>
                      ))}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'dev' && (
            <motion.div
              key="dev"
              className="dev-skills-grid"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
            >
              {devSkills.map(cat => (
                <motion.div key={cat.category} variants={cardVariants}>
                  <TiltCard className="skill-category-card" intensity={8}>
                    <div className="skill-cat-header">
                      <div className="skill-cat-icon">{devCategoryIcons[cat.category]}</div>
                      <span className="skill-cat-title">{cat.category}</span>
                    </div>
                    <div className="skill-tags">
                      {cat.skills.map(skill => (
                        <span className="skill-tag" key={skill}>{skill}</span>
                      ))}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
