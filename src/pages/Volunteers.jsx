import { Link } from 'react-router-dom'
import { useMultiReveal } from '../hooks/useScrollReveal'
import './Volunteers.css'

const volunteers = [
  'Anthony Wang',
  'Aadit Kedia',
  'Shreemay Shah',
  'Aneesh Kashalkar',
  'Sushal Boddeda',
  'Haadi Matin',
  'Vikram Alturu',
  'Adwik Banderjee',
]

export default function Volunteers() {
  const setRef = useMultiReveal(volunteers.length, { staggerDelay: 100 })

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1 className="page-hero-title">Our Volunteers</h1>
          <p className="page-hero-desc">The incredible people who make our mission possible.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="volunteers-grid">
            {volunteers.map((name, i) => (
              <div key={i} className="volunteer-card reveal" ref={setRef(i)}>
                <div className="volunteer-avatar">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="volunteer-name">{name}</h3>
                <span className="volunteer-label">Volunteer</span>
              </div>
            ))}
          </div>

          <div className="volunteer-cta">
            <h2>Want to Join Our Team?</h2>
            <p>We're always looking for passionate individuals who want to make a difference in our community.</p>
            <Link to="/contact" className="btn btn-primary">Become a Volunteer →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
