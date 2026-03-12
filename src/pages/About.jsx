import { useScrollReveal } from '../hooks/useScrollReveal'
import './About.css'

export default function About() {
  const missionRef = useScrollReveal()

  return (
    <div className="page-content">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="about-mission-grid">
            <div className="about-mission-text">
              <span className="section-label">About Us</span>
              <h1 className="page-hero-title">Our Mission</h1>
              <p className="page-hero-desc" style={{ marginBottom: 0 }}>
                Driven by passion, united by purpose.
              </p>
            </div>
            <div className="about-mission-image">
               <img 
                 src="/CUECF_Website/images/events/LCCD_Tree_Planting_Project/IMG_8168.jpg" 
                 alt="Our Mission" 
                 style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: '280px', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }} 
               />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section" ref={missionRef}>
        <div className="container">
          <div className="about-content reveal">
            <div className="about-image-col">
              <img src="/CUECF_Website/images/events/First_project_BirdHousetrimming/mainimage.jpg" alt="Volunteers in garden" className="about-hero-img" />
              <div className="about-image-badge">
                <span className="badge-number">Est. 2023</span>
                <span className="badge-text">Founded by Students</span>
              </div>
            </div>
            <div className="about-text-col">
              <div className="about-text-spacing">
                <p>
                  As students, we have felt there has not been enough emphasis on supporting our surrounding
                  ecosystem and helping our earth and community become a better place for all of us to live —
                  humans, plants, and animals alike.
                </p>
                <p>
                  Through this organization, we aim to help our world by getting fellow volunteers and members
                  in our community to give a hand in projects that will create a more sustainable environment
                  and form a community united.
                </p>
              </div>
              <p className="about-cta-text" style={{ marginTop: '2.5rem', fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                <strong>Join today for a better community and earth tomorrow.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
