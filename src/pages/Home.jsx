import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import './Home.css'

const partners = [
  { name: 'Whitehall Township', logo: '/CUECF_Website/images/logo-whitehall-township.png' },
  { name: 'Lehigh Gap Nature Center', logo: '/CUECF_Website/images/logo-lehigh-gap-nature-center.png' },
  { name: 'Lehigh Valley Audubon Society', logo: '/CUECF_Website/images/logo-lehigh-valley-audubon.png' },
  { name: 'Wildlands Conservancy', logo: '/CUECF_Website/images/logo-wildlands-conservancy.png' },
  { name: 'Lehigh County Conservation District', logo: '/CUECF_Website/images/logo-lehigh-county-conservation.png' },
  { name: 'Hindu Heritage', logo: '/CUECF_Website/images/logo-hindu-heritage.png' },
  { name: 'Parkland High School', logo: '/CUECF_Website/images/ParklandHighSchool.png' },
]

const stats = [
  { value: 11, suffix: '+', label: 'Projects Completed' },
  { value: 8, suffix: '+', label: 'Active Volunteers' },
  { value: 6, suffix: '', label: 'Partner Organizations' },
  { value: 2, suffix: '', label: 'Years of Impact' },
]

export default function Home() {
  const missionRef = useScrollReveal()
  const statsRef = useScrollReveal()
  const partnersRef = useScrollReveal()
  const projectsRef = useScrollReveal()
  const setStatRef = useMultiReveal(stats.length, { staggerDelay: 150 })


  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <img src="/CUECF_Website/images/events/Barn_Cleanup_Images/Group_photo.jpg" alt="CUECF Volunteers" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content container">
          <div className="hero-badge">Environmental Conservation</div>
          <h1 className="hero-title">
            Community <span className="highlight">United</span>
          </h1>
          <p className="hero-subtitle">Environmental Conservation Foundation</p>
          <p className="hero-desc">
            Learn how we united our community in environmental volunteering! Together we have been able to
            combat climate change, restore nature's beauty, and help plants and animals prosper.
          </p>
          <div className="hero-actions">
            <Link to="/about" className="btn btn-primary" id="hero-learn-more">
              Learn More →
            </Link>
            <Link to="/contact" className="btn btn-outline" id="hero-get-involved">
              Get Involved
            </Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="section mission-preview" id="mission-preview">
        <div className="container">
          <div className="mission-grid" ref={missionRef}>
            <div className="mission-text reveal">
              <span className="section-label">Our Mission</span>
              <h2 className="section-title">A Better Community &amp; Earth Tomorrow</h2>
              <p>
                As students, we felt there hasn't been enough emphasis on supporting our surrounding ecosystem.
                Through this organization, we aim to help our world by getting fellow volunteers and members to
                create a more sustainable environment and form a community united.
              </p>
              <Link to="/about" className="btn btn-outline mission-link" id="mission-read-more">
                Read Our Full Mission →
              </Link>
            </div>
            <div className="mission-image reveal">
              <img src="/CUECF_Website/images/events/LCCD_Tree_Planting_Project/IMG_8168.jpg" alt="Nature conservation" />
              <div className="mission-image-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section stats-section" id="stats-section" ref={statsRef}>
        <div className="container reveal">
          <span className="section-label center">Our Impact</span>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card reveal" ref={setStatRef(i)}>
                <div className="stat-value">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1500} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="section partners-section" id="partners-section" ref={partnersRef}>
        <div className="container reveal">
          <h2 className="partners-heading">Our Partners:</h2>
          <div className="partners-grid">
            {partners.map((partner, i) => (
              <div key={i} className="partner-tile">
                <img src={partner.logo} alt={partner.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="section projects-preview" id="projects-preview" ref={projectsRef}>
        <div className="container reveal">
          <span className="section-label">Projects</span>
          <p className="section-subtitle">From birdhouse restoration to native plant gardens, every project brings our community closer together.</p>
          <div className="projects-grid">
            <Link to="/projects/completed" className="project-card" id="project-card-completed">
              <div className="project-card-image">
                <img src="/CUECF_Website/images/events/First_project_BirdHousetrimming/mainimage.jpg" alt="Whitehall Birdhouse Cleanup" />
              </div>
              <div className="project-card-body">
                <span className="project-status completed">✓ Completed</span>
                <h3>Whitehall Birdhouse Cleanup</h3>
                <p>Removing vegetation and replacing birdhouses to restore habitats for bluebirds and swallows.</p>
              </div>
            </Link>
            <Link to="/projects/ongoing" className="project-card" id="project-card-ongoing">
              <div className="project-card-image">
                <img src="/CUECF_Website/images/ParklandHighSchool.png" alt="Parkland HS Native Plant Garden" style={{ objectFit: 'contain', padding: '1rem', backgroundColor: '#fff' }} />
              </div>
              <div className="project-card-body">
                <span className="project-status ongoing">Ongoing</span>
                <h3>Parkland HS Native Plant Garden</h3>
                <p>Designing and building a native plant garden with artificial habitats at Parkland High School.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Make a Difference?</h2>
              <p>Join our community of volunteers and help build a sustainable future for everyone — humans, plants, and animals alike.</p>
              <Link to="/contact" className="btn btn-primary" id="cta-join">Join Us Today →</Link>
            </div>
            <img src="/CUECF_Website/images/logo-cuecf.png" alt="CUECF Logo" className="cta-mascot" />
          </div>
        </div>
      </section>
    </div>
  )
}

