import { useState } from "react";
import NavBar from "../components/layoutComponents/NavBar";
import Sidebar from "../components/layoutComponents/SideBar";
import CreateGame from "../components/userActions/CreateGame";
import CreateCampaign from "../components/CreateCampaign";

export default function LayoutDM({ children }) {
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  return (
    // min-h-screen ensures the layout takes up the full viewport height
    <div className="min-h-screen flex flex-col">
      {/* 1. Navbar sits on top */}
      <NavBar />
      
      {/* 2. Main Area: Flex row splits Sidebar and Page Content */}
      <div className="flex flex-1 relative">
        
        {/* Sidebar wrapper with a fixed width (adjust w-64 to match your Sidebar's width) */}
        <aside className="w-64 shrink-0 hidden md:block">
          <Sidebar 
            onCreateGameClick={() => setIsCreateGameOpen(true)} 
            onCreateCampaignClick={() => setIsCreateCampaignOpen(true)} 
          />
        </aside>

        {/* 3. Page Content: Constrained to remaining width and scrollable if needed */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-24"> {/* pb-24 leaves room for ActionBar */}
          {children}
        </main>
      </div>

      {/* Shared Modals */}
      {isCreateGameOpen && (
        <CreateGame isOpen={isCreateGameOpen} onClose={() => setIsCreateGameOpen(false)} />
      )}
      {isCreateCampaignOpen && (
        <CreateCampaign isOpen={isCreateCampaignOpen} onClose={() => setIsCreateCampaignOpen(false)} />
      )}
    </div>
  );
}
