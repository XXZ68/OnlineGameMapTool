import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Main from './pages/Main'
import Maps from './pages/Maps'
import Profile from './pages/Profile'
import Character from './pages/Character'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Login & Join Game triggers) */}
        <Route path="/" element={<LandingPage />} />

        {/* Main Game Board Page */}
        <Route path="/api/game" element={<Main />} />

        <Route path="/api/Map" element={<Maps />} />

        <Route path="/api/profile" element={<Profile />} />

        <Route path="/api/Character" element={<Character />} />

        <Route path="/418" element={<div>Im a teapot</div>} />
      </Routes>
    </Router>
  )
}

export default App