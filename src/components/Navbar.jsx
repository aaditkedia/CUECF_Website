import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
    setProjectsOpen(false)
    setAboutOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-nav">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" id="nav-home-link">
          <img src="/CUECF_Website/images/logo-cuecf.png" alt="CUECF Logo" className="navbar-logo" />
        </Link>

        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          id="nav-hamburger"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" id="nav-link-home">Home</NavLink>

          <div className="nav-dropdown">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => { setProjectsOpen(!projectsOpen); setAboutOpen(false) }}
              id="nav-projects-toggle"
            >
              Projects <span className={`chevron ${projectsOpen ? 'up' : ''}`}>▾</span>
            </button>
            <div className={`dropdown-menu ${projectsOpen ? 'show' : ''}`}>
              <NavLink to="/projects/completed" className="dropdown-item" id="nav-link-completed">Past Projects</NavLink>
              <NavLink to="/projects/ongoing" className="dropdown-item" id="nav-link-ongoing">Ongoing</NavLink>
              <NavLink to="/photos" className="dropdown-item" id="nav-link-photos">Photos</NavLink>
            </div>
          </div>

          <div className="nav-dropdown">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => { setAboutOpen(!aboutOpen); setProjectsOpen(false) }}
              id="nav-about-toggle"
            >
              About Us <span className={`chevron ${aboutOpen ? 'up' : ''}`}>▾</span>
            </button>
            <div className={`dropdown-menu ${aboutOpen ? 'show' : ''}`}>
              <NavLink to="/about" className="dropdown-item" id="nav-link-mission">Our Mission</NavLink>
              <NavLink to="/team" className="dropdown-item" id="nav-link-team">Current Board Members</NavLink>
              <NavLink to="/team/past" className="dropdown-item" id="nav-link-team-past">Past Board Members</NavLink>
              <NavLink to="/team/volunteers" className="dropdown-item" id="nav-link-team-volunteers">Volunteers</NavLink>
            </div>
          </div>


          <Link to="/contact" className="btn btn-primary nav-cta" id="nav-get-involved">Get Involved</Link>
        </div>
      </div>
    </nav>
  )
}
