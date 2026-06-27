export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">06</span>
          <h2 className="section-title" data-text="Get In Touch">Get In Touch</h2>
        </div>
        <div className="contact-grid">

          {/* ── Left: value proposition ── */}
          <div className="contact-info">
            <h3>Let's Connect</h3>

            <p>
              Open to SOC Analyst, Cybersecurity Analyst, and Blue Team opportunities —
              remote or on-site. I bring documented hands-on investigation experience and
              software engineering depth that few entry-level candidates can match.
            </p>

            <p>
              With 3+ years building enterprise systems at Ryonan Electric Philippines and
              a self-directed cybersecurity curriculum through TryHackMe SOC Level 1 and
              CompTIA Security+, I bridge the gap between development and security
              operations. My background in RPA, Python, Docker, and CI/CD gives me a
              practical edge in understanding attacker tooling and defensive automation.
            </p>

            <p>
              Every investigation I've conducted is fully documented — 15+ page technical
              reports with IOC tables, timeline reconstructions, and MITRE ATT&CK mapping.
              I don't just complete labs; I treat them as real incidents. That discipline
              is what I bring to a SOC team from day one.
            </p>

            <p>
              Based in the Philippines — available for fully remote roles globally and open
              to relocation discussions. Targeting SOC Tier 1 / Tier 2 positions where I
              can contribute immediately with Wireshark, Volatility 3, Snort, Splunk, and
              threat intelligence workflows.
            </p>

            <div className="contact-availability">
              <span className="contact-avail-dot" />
              <span>Available for opportunities · Open to work</span>
            </div>
          </div>

          {/* ── Right: social links ── */}
          <div className="contact-links-col">
            <div className="contact-links-label">REACH OUT</div>
            <div className="contact-links">
              <a href="mailto:zenmier30@gmail.com" className="contact-link">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className="label">Email</span>
                  <span className="value">zenmier30@gmail.com</span>
                </div>
              </a>

              <a href="tel:+639084594581" className="contact-link">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className="label">Phone</span>
                  <span className="value">0908-459-4581 / 0995-234-3604</span>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/zen-mier-86b346276" target="_blank" rel="noreferrer" className="contact-link">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div>
                  <span className="label">LinkedIn</span>
                  <span className="value">linkedin.com/in/zen-mier-86b346276</span>
                </div>
              </a>

              <a href="https://www.github.com/barbatoslupus21" target="_blank" rel="noreferrer" className="contact-link">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div>
                  <span className="label">GitHub</span>
                  <span className="value">github.com/barbatoslupus21</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
