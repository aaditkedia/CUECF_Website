import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/CUECF_Website/images/logo-cuecf.png" alt="CUECF" className="footer-logo" />
            <p>Community United: Environmental Conservation Foundation</p>
            <p className="footer-tagline">Uniting our community for a sustainable future.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/about">Our Mission</Link>
            <Link to="/team">Our Team</Link>
            <Link to="/projects/completed">Completed Projects</Link>
            <Link to="/projects/ongoing">Ongoing Projects</Link>
            <Link to="/photos">Photos</Link>
          </div>

          <div className="footer-links">
            <h4>Get Involved</h4>
            <Link to="/team?tab=volunteers">Become a Volunteer</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <a href="mailto:communityunitedpa@gmail.com">communityunitedpa@gmail.com</a>
            <a href="tel:610-969-5835">610-969-5835</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Community United: Environmental Conservation Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
