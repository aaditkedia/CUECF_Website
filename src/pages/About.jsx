import { useScrollReveal } from '../hooks/useScrollReveal'
import './About.css'

export default function About() {
  const missionRef = useScrollReveal()

  return (
    <div className="page-content">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1 className="page-hero-title">Our Mission</h1>
          <p className="page-hero-desc">Driven by passion, united by purpose.</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section" ref={missionRef}>
        <div className="container">
          <div className="about-content reveal">
            <div className="about-image-col">
              <img src="/images/photo-group-in-garden.png" alt="Volunteers in garden" className="about-hero-img" />
              <div className="about-image-badge">
                <span className="badge-number">Est. 2023</span>
                <span className="badge-text">Founded by Students</span>
              </div>
            </div>
            <div className="about-text-col">
              <h2 className="section-title">Why We Exist</h2>
              <p className="about-statement">
                As students, we have felt there has not been enough emphasis on supporting our surrounding
                ecosystem and helping our earth and community become a better place for all of us to live —
                humans, plants, and animals alike.
              </p>
              <p>
                Through this organization, we aim to help our world by getting fellow volunteers and members
                in our community to give a hand in projects that will create a more sustainable environment
                and form a community united.
              </p>
              <p className="about-cta-text">
                <strong>Join today for a better community and earth tomorrow.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
