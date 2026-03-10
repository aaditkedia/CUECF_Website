import { Link } from 'react-router-dom'
import './Team.css'

export default function PastMembers() {
  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <Link to="/team" className="member-back">← Back to Team</Link>
          <span className="section-label">About Us</span>
          <h1 className="page-hero-title">Past Board Members</h1>
          <p className="page-hero-desc">Honoring those who have contributed to our mission.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="past-members-placeholder">
            <h2>Coming Soon</h2>
            <p>This page will feature our past board members and their contributions to CUECF.</p>
            <Link to="/team" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
              View Current Team →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
