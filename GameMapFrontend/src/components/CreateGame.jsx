
import TextInput from './Input';
import Modal from './Modal';

export default function CreateGame({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create a New Game</h2>
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <p className="block text-sm font-medium text-gray-700">Lobby Name</p>
          <TextInput 
            type="text" 
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" 
            placeholder="My Awesome Game" 
          />
        </div>

        
        <div className="space-y-3">
        {/* 1. Header Label */}
        <span className="block text-sm font-semibold text-gray-700 text-center">
            Player or DM
        </span>

        {/* 2. Centered Radio Button Container */}
        <div className="flex flex-row justify-center items-center gap-12">
            
            {/* Player Option Container */}
            <div className="flex items-center gap-2 cursor-pointer group">
            <input 
                type="radio" 
                id="player" 
                name="RoleDecision" 
                value="player" 
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                defaultChecked
            />
            <label 
                htmlFor="player" 
                className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-gray-900 select-none"
            >
                Player
            </label>
            </div>

            {/* DM Option Container */}
            <div className="flex items-center gap-2 cursor-pointer group">
            <input 
                type="radio" 
                id="dm" 
                name="RoleDecision" 
                value="dm" 
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label 
                htmlFor="dm" 
                className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-gray-900 select-none"
            >
                DM
            </label>
            </div>

        </div>
        </div>


        <div>
          <p className="block text-sm font-medium text-gray-700">Invite Friends</p>
          <input 
            type="text" 
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" 
            placeholder="friend Name" 
          />
        </div>

        <div className="flex flex-row items-center gap-3 text-xs w-full">
        {/* 1. Disabled Text Input */}
        <input 
            type="text" 
            disabled
            className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm focus:outline-none" 
            placeholder="Your Map" 
        />

        {/* 2. Upload Button */}
        <button 
            type="button"
            className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 cursor-pointer"
        >
            Upload Map
        </button>

        {/* 3. Search Button */}
        <button 
            type="button"
            className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 cursor-pointer"
        >
            Search Maps
        </button>
        </div>

        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Launch Lobby
        </button>
      </form>
    </Modal>
  );
}
