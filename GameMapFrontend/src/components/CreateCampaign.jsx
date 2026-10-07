import { useState } from "react";
import Modal from "./Modal";
import TextInput from "./TextInput";
import Button from "./Button";

export default function CreateCampaign({ isOpen, onClose }) {
  const [campaignName, setCampaignName] = useState("");
  const [addMap, setAddMap] = useState(false);
  const [selectedMaps, setSelectedMaps] = useState([]);
  const [availableMaps, setAvailableMaps] = useState([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);
  const [showMapSearchPool, setShowMapSearchPool] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null); // State to hold error messages

  // Fetches the specific map on-demand when the user opens the search panel
  const fetchMaps = async () => {
    setIsLoadingMaps(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch("/api/Map/21709b44-023c-4d73-918d-e479ccd0fad3");

      // Check if the response is not OK (e.g., 404 Not Found, 500 Internal Server Error)
      if (!response.ok) {
        throw new Error(`Failed to load maps. Server responded with status: ${response.status}`);
      }

      // Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Server response was not JSON:", responseText);
        throw new TypeError("Oops! We expected JSON data, but received something else from the server.");
      }

      const data = await response.json();
      
      // CRITICAL: Since the endpoint returns a single map object, 
      // we wrap it in an array so 'availableMaps.filter' and '.map' do not crash the UI.
      const mapsArray = Array.isArray(data) ? data : [data];
      setAvailableMaps(mapsArray);
    } catch (err) {
      console.error("Error retrieving maps:", err);
      setError(err.message); // Store the error message to display in the UI
    } finally {
      setIsLoadingMaps(false);
    }
  };

  // This handler controls when to show the search UI and when to fetch the data
  const handleOpenSearchPool = () => {
    setShowMapSearchPool(true);
    // Only fetch maps if the list is empty to prevent redundant API calls
    if (availableMaps.length === 0) {
      fetchMaps();
    }
  };

  const handleSelectMap = (map) => {
    if (!selectedMaps.some((m) => m.id === map.id)) {
      setSelectedMaps([...selectedMaps, { ...map, isStarting: selectedMaps.length === 0 }]);
    }
    setShowMapSearchPool(false);
  };

  const toggleStartingMap = (mapId) => {
    setSelectedMaps(
      selectedMaps.map((map) => ({
        ...map,
        isStarting: map.id === mapId,
      }))
    );
  };

  const handleLaunchLobby = async (e) => {
    e.preventDefault();
    const startingMap = selectedMaps.find((m) => m.isStarting) || selectedMaps[0];
    const payload = {
      sessionName: campaignName,
      initialMapId: startingMap ? startingMap.id : null,
    };
    try {
      const response = await fetch("/api/GameSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const gameSession = await response.json();
        const auxiliaryMaps = selectedMaps.filter((m) => m.id !== startingMap?.id);
        for (const auxMap of auxiliaryMaps) {
          await fetch(`/api/GameSession/${gameSession.id}/add-map/${auxMap.id}`, {
            method: "POST",
          });
        }
        alert(`Lobby created! Room Code: ${gameSession.joinCode}`);
        onClose();
      } else {
        alert("Failed to create game session.");
      }
    } catch (error) {
      console.error("Error starting lobby:", error);
    }
  };

  const filteredMaps = availableMaps.filter((map) =>
    map.title ? map.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
      <form className="space-y-4" onSubmit={handleLaunchLobby}>
        {/* Campaign Name Input */}
        <div>
          <p className="block text-sm font-medium text-gray-700">Campaign Name</p>
          <TextInput
            type="text"
            className="mt-1 block w-full rounded-md shadow-sm p-2"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>

        {/* Map selection section */}
        <div>
          <p className="block text-sm font-medium text-gray-700">Fill your Campaign with Maps</p>
          <div className="mt-1">
            <Button variant="secondary" type="button" onClick={() => setAddMap(!addMap)}>
              {addMap ? "Hide Map Options" : "Add Map"}
            </Button>
          </div>

          {addMap && (
            <div className="flex gap-5 justify-center mt-3">
              <Button variant="secondary" type="button">Upload Map</Button>
              {/* This button triggers the data fetching */}
              <Button variant="secondary" type="button" onClick={handleOpenSearchPool}>
                Search Map
              </Button>
            </div>
          )}

          {showMapSearchPool && (
            <div className="bg-gray-50 border p-3 rounded-md mt-3 space-y-2 max-h-48 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Select Database Map</span>
                <button type="button" className="text-xs text-red-500 hover:underline" onClick={() => setShowMapSearchPool(false)}>
                  Close
                </button>
              </div>
              <TextInput
                type="text"
                placeholder="Search map titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs p-1"
              />
              {isLoadingMaps ? (
                <p className="text-xs text-gray-500">Querying campaign assets...</p>
              ) : error ? (
                // Displaying the error message in the UI
                <p className="text-xs text-red-500">Error: {error}</p>
              ) : filteredMaps.length === 0 ? (
                <p className="text-xs text-gray-500">No matching maps found.</p>
              ) : (
                <ul className="space-y-1">
                  {filteredMaps.map((map) => (
                    <li key={map.id} className="text-xs flex justify-between items-center border-b py-1">
                      <span>{map.title || "Unnamed Map"}</span>
                      <Button variant="secondary" type="button" onClick={() => handleSelectMap(map)}>
                        Select
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* List of currently selected maps */}
          <ul className="m-2 space-y-2">
            {selectedMaps.map((map) => (
              <li key={map.id} className="flex items-center gap-2 justify-between border-b pb-1">
                <span className="text-sm font-medium">{map.title || "Unnamed Map"}</span>
                <div className="flex gap-2">
                  <Button variant={map.isStarting ? "primary" : "secondary"} type="button" onClick={() => toggleStartingMap(map.id)}>
                    {map.isStarting ? "★ Starting Map" : "Set Starting"}
                  </Button>
                  <Button variant="danger" type="button" onClick={() => setSelectedMaps(selectedMaps.filter((m) => m.id !== map.id))}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form actions */}
        <div className="flex flex-row gap-4 justify-center pt-4">
          <Button variant="primary" type="submit">Launch Lobby</Button>
          <Button variant="danger" type="button" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
