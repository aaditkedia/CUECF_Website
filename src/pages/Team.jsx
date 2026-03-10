import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { teamMembers } from '../data/team'
import './Team.css'

export default function Team() {
  const headerRef = useScrollReveal()
  const setRef = useMultiReveal(teamMembers.length)

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
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <Link
                to={`/team/${member.id}`}
                key={member.id}
                className="team-card reveal"
                ref={setRef(i)}
              >
                <div className="team-card-img">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-card-body">
                  <h3>{member.name}</h3>
                  <p className="team-card-role">{member.role}</p>
                  <p className="team-card-excerpt">{member.excerpt}</p>
                  <span className="team-card-link">Read Bio →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="team-footer-links">
            <Link to="/past-members" className="btn btn-outline">View Past Board Members</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
