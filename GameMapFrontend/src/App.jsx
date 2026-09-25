import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Main from './pages/Main';
import './App.css';
import Maps from './pages/Maps';
import Profile from './pages/Profile';
import Character from './pages/Character';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Login & Join Game triggers) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Main Game Board Page */}
        <Route path="/game" element={<Main />} />

        <Route path="/maps" element={<Maps />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/char" element={<Character />} />
      </Routes>
    </Router>
  );
}

export default App;
