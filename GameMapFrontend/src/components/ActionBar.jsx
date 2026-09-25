import Button from "./atoms/buttons/Button";

function ActionBar({ activePanel, onTogglePanel }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-transparent backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200">
            <Button 
                variant={activePanel === "spells" ? "secondary" : "primary"} 
                onClick={() => onTogglePanel("spells")}
            >
                My Actions/Spells
            </Button>
            
            <Button 
                variant={activePanel === "inventory" ? "secondary" : "primary"} 
                onClick={() => onTogglePanel("inventory")}
            >
                Inventory
            </Button>
            
            <Button 
                variant={activePanel === "notes" ? "secondary" : "primary"} 
                onClick={() => onTogglePanel("notes")}
            >
                Notes
            </Button>
        </div>
    );
}

export default ActionBar;
