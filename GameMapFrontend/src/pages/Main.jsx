import { useState } from "react";
import ActionBar from "../components/gameComponents/ActionBar";
import SimpleSectionCard from "../components/atoms/SimpleSectionCard";
import NotesForm from "../components/gameComponents/NotesForm";
import Inventory from "../components/gameComponents/Inventory";
import Actions from "../components/gameComponents/Actions";
import Button from "../components/atoms/Button";
import CreateGame from "../components/userActions/CreateGame";
import CreateCampaign from "../components/userActions/CreateCampaign";
import NavBar from "../components/layoutComponents/NavBar";

function Main() {
  const [activePanel, setActivePanel] = useState(null);
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openCreateCampaign, setOpenCreateCampaign] = useState(false);

  const togglePanel = (panelName) => {
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  };

  return (
    <>
      <NavBar />
      {/* Content wrapper: Simplified classes to prevent escaping containment */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl w-full mx-auto p-6">
        
        {/* Left Side: Main Game Board (grows/shrinks smoothly) */}
        <div className="flex-1 min-w-0">
          <SimpleSectionCard className="flex gap-4 justify-center items-center">
            {/* FIX 1: Click handler opens Game, text corrected to "Create New Game" */}
            <Button 
              variant="primary" 
              onClick={() => setOpenCreateGame(true)}
            >
              Create New Game
            </Button>
            
            {/* FIX 2: Click handler opens Campaign, text is "Create New Campaign" */}
            <Button 
              variant="primary" 
              onClick={() => setOpenCreateCampaign(true)}
            >
              Create New Campaign
            </Button>
          </SimpleSectionCard>
        </div>

        {/* Modal/Form Views */}
        {openCreateGame && (
          <CreateGame isOpen={openCreateGame} onClose={() => setOpenCreateGame(false)} />
        )}
        {openCreateCampaign && (
          <CreateCampaign isOpen={openCreateCampaign} onClose={() => setOpenCreateCampaign(false)} />
        )}

        {/* Right Side: Toggle Panel (occupies space only when open) */}
        {activePanel && (
          <div className="w-full lg:w-66 shrink-0 transition-all duration-300">
            <SimpleSectionCard>
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="font-bold text-lg capitalize">{activePanel}</h3>
                <button 
                  onClick={() => setActivePanel(null)}
                  className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
              
              {/* Render content based on what is active */}
              <div className="mt-2">
                {activePanel === "notes" && <NotesForm />}
                {activePanel === "inventory" && <Inventory />}
                {activePanel === "spells" && <Actions />}
              </div>
            </SimpleSectionCard>
          </div>
        )}
      </div>

      {/* State control on ActionBar */}
      <ActionBar activePanel={activePanel} onTogglePanel={togglePanel} />
    </>
  );
}

export default Main;
