import { useParams, Link, Navigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { completedProjects, ongoingProjects } from '../data/projects'
import './Projects.css'

export default function ProjectDetail() {
  const { type, projectId } = useParams()
  const contentRef = useScrollReveal()

  const allProjects = type === 'completed' ? completedProjects : ongoingProjects
  const project = allProjects.find(p => p.id === projectId)

  if (!project) {
    return <Navigate to={`/projects/${type}`} replace />
  }

  const isCompleted = type === 'completed'

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <Link to={`/projects/${type}`} className="detail-back">
            ← Back to {isCompleted ? 'Completed' : 'Ongoing'} Projects
          </Link>
          <span className="section-label">{isCompleted ? 'Completed Project' : 'Ongoing Project'}</span>
          <h1 className="page-hero-title">{project.title}</h1>
          <p className="page-hero-desc">{project.partner}</p>
        </div>
      </section>

      <section className="section" ref={contentRef}>
        <div className="container">
          <div className="project-detail-layout reveal">
            {project.gallery && project.gallery.length > 0 && (
              <div className="project-detail-gallery">
                {project.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} - Photo ${i + 1}`} />
                ))}
              </div>
            )}

            <div className="project-detail-info">
              <div className="project-detail-meta">
                <span className={`project-card-status ${isCompleted ? 'completed' : 'ongoing'}`}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
                <span className="project-detail-location">{project.location}</span>
              </div>

              <h2>{project.title}</h2>

              <div className="project-detail-desc">
                {project.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <p className="project-detail-partner">{project.partner}</p>

              <div className="project-highlights-grid">
                {project.highlights.map((h, i) => (
                  <div key={i} className="highlight-stat">
                    <span className="number">{h.number}</span>
                    <span className="label">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
