import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { pastMembers } from '../data/pastMembers'
import './Team.css'

export default function PastMembers() {
  const headerRef = useScrollReveal()
  const setRef = useMultiReveal(pastMembers.length)

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <Link to="/team" className="member-back">← Back to Current Team</Link>
          <span className="section-label">About Us</span>
          <h1 className="page-hero-title">Past Board Members</h1>
          <p className="page-hero-desc">Honoring those who have contributed to our mission.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" ref={headerRef}>
          <div className="team-grid">
            {pastMembers.map((member, i) => (
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
        </div>
      </section>
    </div>
  )
}
