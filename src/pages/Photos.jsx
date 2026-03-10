import { useState, useEffect, useCallback } from 'react'
import './Photos.css'

const photos = [
  { src: '/CUECF_Website/images/events/Barn_Cleanup_Images/Group_photo.jpg', caption: 'Volunteer team at the Whitehall Township Barn Cleanup' },
  { src: '/CUECF_Website/images/events/LCCD_Tree_Planting_Project/IMG_8168.jpg', caption: 'Tree planting with Lehigh County Conservation District' },
  { src: '/CUECF_Website/images/events/Collaboration_with_Hindu_Temple_Society/IMG_5749.jpg', caption: 'Hindu Temple grounds restoration collaboration' },
  { src: '/CUECF_Website/images/events/E-Recycleing_29th_June_2024/image.jpg', caption: 'Community E-Recycling Day event' },
  { src: '/CUECF_Website/images/events/First_project_BirdHousetrimming/mainimage.jpg', caption: 'Birdhouse restoration at Whitehall Township' },
  { src: '/CUECF_Website/images/events/Fullerton_Road_Side_Cleanup/20241109_100926.jpg', caption: 'Fullerton Road Side Cleanup' },
  { src: '/CUECF_Website/images/events/Keiosk/1.jpg', caption: 'Informational kiosk for Whitehall Township' },
  { src: '/CUECF_Website/images/events/Jays_Eagle_Project/image.jpg', caption: "Jay's Eagle Scout Project" },
  { src: '/CUECF_Website/images/events/Invasive_SpeciesRemoval_HabitatRestoration/image1.png', caption: 'Invasive species removal and habitat restoration' },
  { src: '/CUECF_Website/images/events/LCCD_Tree_Planting_Project/IMG_9169.jpg', caption: 'Volunteers planting trees for LCCD project' },
  { src: '/CUECF_Website/images/events/Collaboration_with_Hindu_Temple_Society/IMG_5831.jpg', caption: 'Team working at the Hindu Temple grounds' },
  { src: '/CUECF_Website/images/events/Barn_Cleanup_Images/FInished.jpg', caption: 'Completed barn cleanup project' },
  { src: '/CUECF_Website/images/events/E-Recycleing_29th_June_2024/Dunken_Spnsor_Zunair.jpg', caption: 'Sponsor support at E-Recycling Day' },
  { src: '/CUECF_Website/images/events/LCCD_Tree_Planting_Project/IMG_4811.jpg', caption: 'Native tree planting in Lehigh County' },
  { src: '/CUECF_Website/images/events/Whitehall_Invasive_Species_Removal/IMG_8462.jpg', caption: 'Whitehall invasive species removal' }
]

export default function Photos() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % photos.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + photos.length) % photos.length)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  return (
    <div className="page-content">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Gallery</span>
          <h1 className="page-hero-title">Photos</h1>
          <p className="page-hero-desc">Browse through our conservation work in action.</p>
        </div>
      </section>

      <section className="slider-section">
        <div className="container">
          <div className="slider-wrapper">
            <div className="slider-main">
              <button className="slider-arrow slider-prev" onClick={prev} aria-label="Previous photo">
                ←
              </button>

              <div className="slider-image-container">
                <img
                  key={current}
                  src={photos[current].src}
                  alt={photos[current].caption}
                  className={`slider-image ${direction >= 0 ? 'slide-in-right' : 'slide-in-left'}`}
                />
              </div>

              <button className="slider-arrow slider-next" onClick={next} aria-label="Next photo">
                →
              </button>
            </div>

            <div className="slider-info">
              <p className="slider-caption">{photos[current].caption}</p>
              <p className="slider-counter">{current + 1} / {photos.length}</p>
            </div>

            <div className="slider-thumbnails">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  className={`slider-thumb ${i === current ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={photo.src} alt={photo.caption} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
