import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { volunteers } from '../data/volunteers'
import './Team.css'

export default function Volunteers() {
  const headerRef = useScrollReveal()
  const volRef = useMultiReveal(volunteers.length, { staggerDelay: 100 })

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1 className="page-hero-title">Our Team</h1>
          <p className="page-hero-desc">Meet the passionate individuals leading our mission.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" ref={headerRef}>
          <div className="team-tabs">
            <Link 
              to="/team"
              className="tab-btn"
            >
              Current Board Members
            </Link>
            <Link 
              to="/team/past"
              className="tab-btn"
            >
              Past Board Members
            </Link>
            <Link 
              to="/team/volunteers"
              className="tab-btn active"
            >
              Volunteers
            </Link>
          </div>

          <div className="volunteers-section reveal">
            <div className="volunteers-grid">
              {volunteers.map((name, i) => (
                <div key={i} className="volunteer-card reveal" ref={volRef(i)}>
                  <div className="volunteer-avatar">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="volunteer-name">{name}</h3>
                  <span className="volunteer-label">Volunteer</span>
                </div>
              ))}
            </div>

            <div className="volunteer-cta reveal">
              <h2>Want to Join Our Team?</h2>
              <p>We're always looking for passionate individuals who want to make a difference in our community.</p>
              <Link to="/contact" className="btn btn-primary">Become a Volunteer →</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
