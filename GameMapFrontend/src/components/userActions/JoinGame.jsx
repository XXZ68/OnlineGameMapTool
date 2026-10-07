import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../atoms/TextInput';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';

export default function JoinGame({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState('');

  const handleLaunchLobby = (e) => {
    e.preventDefault();
    
    console.log(`Launching lobby "${lobbyName}"`);

    onClose(); 
    navigate('/api/game'); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Join Game</h2>
      
      <form onSubmit={handleLaunchLobby} className="space-y-4">
        
        <TextInput 
          type="text" 
          className="mt-1 block w-full rounded-md shadow-sm p-2" 
          placeholder="Game ID" 
          value={lobbyName}
          onChange={(e) => setLobbyName(e.target.value)}
        />

        <div className='flex flex-row gap-4 justify-center'>
          <Button variant='primary' type="submit">
            Join Lobby
          </Button>
          
          <Button variant='danger' type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
