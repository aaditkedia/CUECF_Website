import { Link } from 'react-router-dom'
import { useScrollReveal, useMultiReveal } from '../hooks/useScrollReveal'
import { completedProjects } from '../data/projects'
import './Projects.css'

export default function CompletedProjects() {
  const headerRef = useScrollReveal()
  const setRef = useMultiReveal(completedProjects.length)

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Projects</span>
          <h1 className="page-hero-title">Completed Projects</h1>
          <p className="page-hero-desc">
            Explore the conservation projects we have successfully completed across the Lehigh Valley.
          </p>
        </div>
      </section>

      <section className="section" ref={headerRef}>
        <div className="container">
          <div className="project-listing-grid">
            {completedProjects.map((project, i) => (
              <Link
                to={`/projects/completed/${project.id}`}
                key={project.id}
                className="project-listing-card reveal"
                ref={setRef(i)}
              >
                <div className="project-listing-img">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-listing-body">
                  <span className="project-card-status completed">Completed</span>
                  <h3>{project.title}</h3>
                  <p className="project-listing-partner">{project.partner}</p>
                  <p className="project-listing-summary">{project.summary}</p>
                  <span className="project-listing-link">View Project Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
