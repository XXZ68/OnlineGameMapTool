import { useState } from "react";
import ActionBar from "../components/ActionBar";
import { SimpleSectionCard } from "../components/SimpleSectionCard";
import NotesForm from "../components/NotesForm";
import Inventory from "../components/Inventory";
import Actions from "../components/Actions";
import LayoutDM from "../layouts/LayoutDM";

function Main() {
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panelName) => {
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  };

  return (
    <LayoutDM>
      {/* Content wrapper: Simplified classes to prevent escaping containment */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl w-full mx-auto p-6">
        
        {/* Left Side: Main Game Board (grows/shrinks smoothly) */}
        <div className="flex-1 min-w-0">
          <SimpleSectionCard>
            <h2 className="text-xl font-bold mb-4">Hier wird das Main GameBoard geladen</h2>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero soluta quaerat fugiat quo, perferendis ratione perspiciatis optio ad ut explicabo nobis quos voluptatem...
            </p>
          </SimpleSectionCard>
        </div>

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
    </LayoutDM>
  );
}

export default Main;
