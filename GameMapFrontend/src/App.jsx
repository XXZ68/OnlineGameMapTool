import { useState } from 'react';
import CreateGame from './components/CreateGame'; // Adjust the import path as needed
import './App.css';
import NavBar from './components/NavBar';
import { SectionCard } from './components/SectionCard';
import { SimpleSectionCard } from './components/SimpleSectionCard';

function App() {
  const [showCreateGame, setShowCreateGame] = useState(false);

  return (
    <>
     <NavBar />

      <SectionCard title="Welcome" badge="welcome">
        <div>Hello</div>
        <div>World</div>        
      </SectionCard>

      <SimpleSectionCard >
        <div>Hello</div>
        <div>World</div>           
      </SimpleSectionCard>

      <SimpleSectionCard >
        <div>This lets the User create a game decide if they are dm or player then lets them upload a template for map</div>

        <button type="button" onClick={() => setShowCreateGame(true)} className='hover:bg-blue-600 hover:text-black px-2 rounded'>
          Create Game
        </button>

        <CreateGame 
          isOpen={showCreateGame} 
          onClose={() => setShowCreateGame(false)} 
        />
      </SimpleSectionCard>

    </>
  );
}

export default App;
