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
            ← Back to {isCompleted ? 'Past' : 'Ongoing'} Projects
          </Link>
          <span className="section-label">{isCompleted ? 'Past Project' : 'Ongoing Project'}</span>
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
                  {isCompleted ? 'Past Project' : 'In Progress'}
                </span>
                <span className="project-detail-location">{project.location}</span>
              </div>

              <h2>{project.title}</h2>

              <div className="project-detail-desc">
                {project.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {project.beforeImage && project.afterImage && (
                <div className="project-before-after">
                  <div className="before-image">
                    <span className="image-label">Before</span>
                    <img src={project.beforeImage} alt={`Before ${project.title}`} />
                  </div>
                  <div className="after-image">
                    <span className="image-label">After</span>
                    <img src={project.afterImage} alt={`After ${project.title}`} />
                  </div>
                </div>
              )}

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
