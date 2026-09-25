import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from './TextInput';
import Modal from './Modal';
import Button from './atoms/buttons/Button';

export default function CreateGame({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState('');

  const handleLaunchLobby = (e) => {
    e.preventDefault();
    
    console.log(`Launching lobby "${lobbyName}"`);

    onClose(); 
    navigate('/game'); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create a New Game</h2>
      
      <form onSubmit={handleLaunchLobby} className="space-y-4">
        <div>
          <p className="block text-sm font-medium text-gray-700">Lobby Name</p>
          <TextInput 
            type="text" 
            className="mt-1 block w-full rounded-md shadow-sm p-2" 
            placeholder="My Awesome Game" 
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
          />
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700">Session Name</p>
          <TextInput 
            type="text" 
            className="mt-1 block w-full rounded-md shadow-sm p-2" 
            placeholder="Character Name" 
          />
        </div>

        <div className="flex flex-row items-center gap-3 text-xs w-full">
          <input 
            type="text" 
            disabled
            className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm focus:outline-none" 
            placeholder="Your Map" 
          />
          <Button variant='secondary' type="button">Upload Map</Button>
          <Button variant='secondary' type="button">Search Maps</Button>
        </div>
        <div className='flex flex-row gap-4 justify-center'>
          <Button variant='primary' type="submit">
            Launch Lobby
          </Button>
          
          <Button variant='danger' type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
