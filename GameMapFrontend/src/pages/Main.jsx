import { useState } from "react";
import ActionBar from "../components/ActionBar";
import NavBar from "../components/NavBar";
import { SimpleSectionCard } from "../components/SimpleSectionCard";
import NotesForm from "../components/NotesForm";
import Inventory from "../components/Inventory";
import Actions from "../components/Actions";

function Main() {
    // Track which panel is currently open: null, 'spells', 'inventory', or 'notes'
    const [activePanel, setActivePanel] = useState(null);

    const togglePanel = (panelName) => {
        setActivePanel((prev) => (prev === panelName ? null : panelName));
    };

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <NavBar />

            {/* Layout Wrapper: Relative container so we can absolutely position the sidebar */}
            <div className="flex-grow flex items-start justify-center gap-4 max-w-7xl w-auto mx-auto p-6 relative">
                
                <div className="w-full max-w-2xl shrink-0">
                    <SimpleSectionCard>
                        <h2 className="text-xl font-bold mb-4">Hier wird das Main GameBoard geladen</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero soluta quaerat fugiat quo, perferendis ratione perspiciatis optio ad ut explicabo nobis quos voluptatem...
                        </p>
                    </SimpleSectionCard>
                </div>

                <div 
                    className={`
                        ${activePanel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none hidden'}
                    `}
                >
                    <SimpleSectionCard>
                        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                            <h3 className="font-bold text-lg capitalize">{activePanel}</h3>
                            <button 
                                onClick={() => setActivePanel(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Render content based on what is active */}
                        {activePanel === "notes" && (
                            <NotesForm />
                        )}
                        {activePanel === "inventory" && (
                            <Inventory />
                        )}
                        {activePanel === "spells" && (
                            <Actions />
                        )}
                    </SimpleSectionCard>
                </div>
            </div>

            {/* Pass state control down to the ActionBar */}
            <ActionBar activePanel={activePanel} onTogglePanel={togglePanel} />
        </div>
    );
}

export default Main;
