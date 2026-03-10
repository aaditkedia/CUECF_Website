import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { teamMembers } from '../data/team'
import { pastMembers } from '../data/pastMembers'
import { volunteers } from '../data/volunteers'
import './Team.css'

export default function Team() {
  const [activeTab, setActiveTab] = useState('current')
  const location = useLocation()
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab === 'past' || tab === 'volunteers') {
      setActiveTab(tab)
    } else {
      setActiveTab('current')
    }
  }, [location])

  const headerRef = useScrollReveal()
  const teamRef = useMultiReveal(teamMembers.length)
  const pastRef = useMultiReveal(pastMembers.length)
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
            <button 
              className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              Current Board Members
            </button>
            <button 
              className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Board Members
            </button>
            <button 
              className={`tab-btn ${activeTab === 'volunteers' ? 'active' : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              Volunteers
            </button>
          </div>

          {activeTab === 'current' && (
            <div className="team-grid">
              {teamMembers.map((member, i) => (
                <Link
                  to={`/team/${member.id}`}
                  key={member.id}
                  className="team-card reveal"
                  ref={teamRef(i)}
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
          )}

          {activeTab === 'past' && (
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
          )}

          {activeTab === 'volunteers' && (
            <div>
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

              <div className="volunteer-cta reveal" ref={headerRef}>
                <h2>Want to Join Our Team?</h2>
                <p>We're always looking for passionate individuals who want to make a difference in our community.</p>
                <Link to="/contact" className="btn btn-primary">Become a Volunteer →</Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
