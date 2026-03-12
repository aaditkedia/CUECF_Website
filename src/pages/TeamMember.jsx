import { useParams, Link, Navigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { teamMembers, memberBios } from '../data/team'
import { pastMembers, pastMemberBios } from '../data/pastMembers'
import './Team.css'

export default function TeamMember() {
  const { memberId } = useParams()
  const contentRef = useScrollReveal()

  const allMembers = [...teamMembers, ...pastMembers]
  const allBios = { ...memberBios, ...pastMemberBios }

  const member = allMembers.find(m => m.id === memberId)
  const details = allBios[memberId]

  if (!member || !details) {
    return <Navigate to="/team" replace />
  }

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <Link to="/team" className="member-back">← Back to Team</Link>
          <h1 className="page-hero-title">{member.name}</h1>
          <p className="page-hero-desc">{member.role}</p>
        </div>
      </section>

      <section className="section" ref={contentRef}>
        <div className="container">
          <div className="member-detail reveal">
            <div className="member-photo">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="member-info">
              <span className="member-role-badge">{member.role}</span>

              <div className="member-bio">
                <h2>About {member.name.split(' ')[0]}</h2>
                {details.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="member-details-grid">
                {details.email && (
                  <div className="member-detail-card">
                    <h3>Email</h3>
                    <p>{details.email}</p>
                  </div>
                )}
                {details.location && (
                  <div className="member-detail-card">
                    <h3>Location</h3>
                    <p>{details.location}</p>
                  </div>
                )}
                {details.joined && (
                  <div className="member-detail-card">
                    <h3>Joined</h3>
                    <p>{details.joined}</p>
                  </div>
                )}
                {details.focus && (
                  <div className="member-detail-card">
                    <h3>Focus Area</h3>
                    <p>{details.focus}</p>
                  </div>
                )}
              </div>

              <Link to="/contact" className="btn btn-primary">Get in Touch →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
