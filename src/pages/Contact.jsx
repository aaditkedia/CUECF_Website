import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Contact.css'

export default function Contact() {
  const formRef = useScrollReveal()
  const infoRef = useScrollReveal()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', subject: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="page-hero-desc">Have questions or want to get involved? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-wrap reveal" ref={formRef}>
              <h2>Send Us a Message</h2>
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text" id="firstName" name="firstName"
                        value={form.firstName} onChange={handleChange}
                        required placeholder="John"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text" id="lastName" name="lastName"
                        value={form.lastName} onChange={handleChange}
                        required placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email" id="email" name="email"
                      value={form.email} onChange={handleChange}
                      required placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text" id="subject" name="subject"
                      value={form.subject} onChange={handleChange}
                      required placeholder="How can we help?"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message" name="message" rows="5"
                      value={form.message} onChange={handleChange}
                      required placeholder="Tell us what's on your mind..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary form-submit" id="contact-submit">
                    Send Message →
                  </button>
                </form>
              )}
            </div>

            <div className="contact-info reveal" ref={infoRef}>
              <div className="info-card">
                <div className="info-icon">Email</div>
                <h3>Email Us</h3>
                <a href="mailto:communityunitedpa@gmail.com">communityunitedpa@gmail.com</a>
                <a href="mailto:aaditkedia1@gmail.com">aaditkedia1@gmail.com</a>
                <a href="mailto:anthonywang1215@gmail.com">anthonywang1215@gmail.com</a>
              </div>
              <div className="info-card">
                <div className="info-icon">Phone</div>
                <h3>Call Us</h3>
                <a href="tel:610-969-5835">610-969-5835</a>
              </div>
              <div className="info-card">
                <div className="info-icon">Location</div>
                <h3>Location</h3>
                <p>Whitehall Township, Pennsylvania</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
