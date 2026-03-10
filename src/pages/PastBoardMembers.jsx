import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { pastMembers } from '../data/pastMembers'
import './Team.css'

export default function PastBoardMembers() {
  const headerRef = useScrollReveal()
  const pastRef = useMultiReveal(pastMembers.length)

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
              className="tab-btn active"
            >
              Past Board Members
            </Link>
            <Link 
              to="/team/volunteers"
              className="tab-btn"
            >
              Volunteers
            </Link>
          </div>

          <div className="team-grid">
            {pastMembers.map((member, i) => (
              <Link
                to={`/team/${member.id}`}
                key={member.id}
                className="team-card reveal"
                ref={pastRef(i)}
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
