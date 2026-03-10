import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import TeamMember from './pages/TeamMember'
import CompletedProjects from './pages/CompletedProjects'
import OngoingProjects from './pages/OngoingProjects'
import ProjectDetail from './pages/ProjectDetail'
import Photos from './pages/Photos'
import Contact from './pages/Contact'

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:memberId" element={<TeamMember />} />
        <Route path="/projects/completed" element={<CompletedProjects />} />
        <Route path="/projects/ongoing" element={<OngoingProjects />} />
        <Route path="/projects/:type/:projectId" element={<ProjectDetail />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  )
}
