import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const BACKEND_URL = 'http://localhost:5089';

export default function ActiveMap({ sessionId, mapId, currentUser }) {
  // --- 1. STATE ---
  const [mapData, setMapData] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [grid, setGrid] = useState(null);
  const [activeSpells, setActiveSpells] = useState([]);
  const [error, setError] = useState(null);

  // References
  const hubConnectionRef = useRef(null);
  const mapContainerRef = useRef(null);
  // Track current zoom scale for drop calculations (default 1)
  const currentScaleRef = useRef(1);

  // Derived loading state
  const isLoading = !mapData || mapData.id !== mapId;

  // --- 2. FETCH INITIAL MAP DATA ---
  useEffect(() => {
    let isMounted = true;

    fetch(`${BACKEND_URL}/api/Map/${mapId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load map: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setMapData(data);
        setGrid(data.grid);
        setTokens(data.tokens || []);
        setActiveSpells(data.activeSpells || []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [mapId]);

  // --- 3. SIGNALR REAL-TIME SYNC ---
  useEffect(() => {
    if (!sessionId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BACKEND_URL}/hubs/map`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connection.on('TokenMoved', (tokenId, newGridX, newGridY) => {
      setTokens((prev) =>
        prev.map((t) => (t.id === tokenId ? { ...t, gridX: newGridX, gridY: newGridY } : t))
      );
    });

    connection.on('TokenSpawned', (newToken) => {
      setTokens((prev) => [...prev, newToken]);
    });

    connection.on('TokenHpChanged', (tokenId, newHp) => {
      setTokens((prev) =>
        prev.map((t) => (t.id === tokenId ? { ...t, currentHp: newHp } : t))
      );
    });

    connection.on('TokenRemoved', (tokenId) => {
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    });

    connection.on('GridUpdated', (updatedGrid) => {
      setGrid(updatedGrid);
    });

    connection.on('SpellCasted', (spellEvent) => {
      setActiveSpells((prev) => [...prev, spellEvent]);
    });

    connection.on('SpellDismissed', (spellId) => {
      setActiveSpells((prev) => prev.filter((s) => s.id !== spellId && s.activeSpellId !== spellId));
    });

    connection
      .start()
      .then(async () => {
        await connection.invoke(
          'JoinSession',
          sessionId,
          currentUser.playerId,
          currentUser.playerName
        );
      })
      .catch((err) => console.error('SignalR error:', err));

    hubConnectionRef.current = connection;

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current
          .invoke('LeaveSession', sessionId, currentUser.playerId)
          .catch(() => {})
          .finally(() => {
            hubConnectionRef.current.stop();
          });
      }
    };
  }, [sessionId, currentUser.playerId, currentUser.playerName]);

  // --- 4. TOKEN DRAG & DROP WITH ZOOM CORRECTION ---
  const canMoveToken = (token) => {
    if (currentUser.isDungeonMaster) return true;
    if (token.isLocked) return false;
    return token.characterId === currentUser.selectedCharacterId;
  };

  const handleDragStart = (e, token) => {
    if (!canMoveToken(token)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', token.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const tokenId = e.dataTransfer.getData('text/plain');
    if (!tokenId || !grid || !mapContainerRef.current) return;

    // 1. Get bounding rect of the unzoomed container
    const containerRect = mapContainerRef.current.getBoundingClientRect();

    // 2. Adjust for CSS transform scale!
    const scale = currentScaleRef.current || 1;
    const dropX = (e.clientX - containerRect.left) / scale;
    const dropY = (e.clientY - containerRect.top) / scale;

    // 3. Snap to grid indices
    const targetGridX = Math.floor((dropX - (grid.offsetX || 0)) / grid.cellSizeInPixels);
    const targetGridY = Math.floor((dropY - (grid.offsetY || 0)) / grid.cellSizeInPixels);

    // Optimistic UI update
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, gridX: targetGridX, gridY: targetGridY } : t))
    );

    // Sync via SignalR
    if (hubConnectionRef.current) {
      try {
        await hubConnectionRef.current.invoke(
          'MoveToken',
          sessionId,
          tokenId,
          targetGridX,
          targetGridY
        );
      } catch (err) {
        console.error('Failed to sync token move:', err);
      }
    }
  };

  // --- 5. RENDER ---
  if (error) {
    return <div style={{ color: '#ff6b6b', padding: '20px' }}>Error: {error}</div>;
  }

  if (isLoading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading Battle Map...</div>;
  }

  const cellSize = grid?.cellSizeInPixels || 50;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#121212' }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        panning={{ excluded: ['vtt-token'] }} // Prevent canvas panning while dragging a token!
        onTransformed={(ref) => {
          // Keep scale updated for drop calculations
          currentScaleRef.current = ref.state.scale;
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* --- FLOATING ZOOM CONTROLS --- */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                zIndex: 100,
                display: 'flex',
                gap: '8px',
                background: 'rgba(20, 20, 20, 0.85)',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <button
                onClick={() => zoomIn()}
                style={buttonStyle}
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                style={buttonStyle}
                title="Zoom Out"
              >
                -
              </button>
              <button
                onClick={() => resetTransform()}
                style={{ ...buttonStyle, width: 'auto', padding: '0 10px', fontSize: '12px' }}
                title="Reset View"
              >
                Reset
              </button>
            </div>

            {/* --- PAN & ZOOM CANVAS --- */}
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div
                ref={mapContainerRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  position: 'relative',
                  width: mapData.widthInPixels,
                  height: mapData.heightInPixels,
                  backgroundImage: `url(${mapData.imageUrl})`,
                  backgroundSize: 'cover',
                  userSelect: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                }}
              >
                {/* --- SVG GRID OVERLAY --- */}
                {grid && (
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    <defs>
                      <pattern
                        id="gridPattern"
                        width={cellSize}
                        height={cellSize}
                        patternUnits="userSpaceOnUse"
                        x={grid.offsetX || 0}
                        y={grid.offsetY || 0}
                      >
                        <path
                          d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                          fill="none"
                          stroke={grid.lineColor || '#ffffff'}
                          strokeWidth="1"
                          strokeOpacity={grid.lineOpacity ?? 0.3}
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridPattern)" />

                    {/* Spell Templates */}
                    {activeSpells.map((spell) => {
                      const originX = (grid.offsetX || 0) + (spell.originGridX ?? spell.targetGridX ?? 0) * cellSize + cellSize / 2;
                      const originY = (grid.offsetY || 0) + (spell.originGridY ?? spell.targetGridY ?? 0) * cellSize + cellSize / 2;
                      const radiusPx = (spell.radiusInCells || 1) * cellSize;

                      return (
                        <circle
                          key={spell.id || spell.eventId}
                          cx={originX}
                          cy={originY}
                          r={radiusPx}
                          fill={spell.colorHex || '#ff0055'}
                          fillOpacity={0.3}
                          stroke={spell.colorHex || '#ff0055'}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </svg>
                )}

                {/* --- TOKENS LAYER --- */}
                {tokens.map((token) => {
                  if (!token.isVisibleToPlayers && !currentUser.isDungeonMaster) {
                    return null;
                  }

                  const size = (token.sizeInCells || 1) * cellSize;
                  const left = (grid?.offsetX || 0) + token.gridX * cellSize;
                  const top = (grid?.offsetY || 0) + token.gridY * cellSize;
                  const draggable = canMoveToken(token);

                  return (
                    <div
                      key={token.id}
                      className="vtt-token" // Excluded class so dragging a token doesn't pan the canvas!
                      draggable={draggable}
                      onDragStart={(e) => handleDragStart(e, token)}
                      title={`${token.name} (${token.currentHp}/${token.maxHp} HP)`}
                      style={{
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: '50%',
                        backgroundImage: token.tokenImageUrl
                          ? `url(${token.tokenImageUrl})`
                          : 'radial-gradient(circle, #e63946, #b7094c)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: draggable ? '2px solid #52b788' : '2px solid #333',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                        cursor: draggable ? 'grab' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* Health Bar */}
                      <div
                        style={{
                          width: '80%',
                          height: '4px',
                          background: '#444',
                          borderRadius: '2px',
                          marginBottom: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(0, Math.min(100, (token.currentHp / token.maxHp) * 100))}%`,
                            height: '100%',
                            background: token.currentHp / token.maxHp > 0.3 ? '#2dc653' : '#d90429',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

const buttonStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#2b2b2b',
  color: '#ffffff',
  border: '1px solid #444',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};
