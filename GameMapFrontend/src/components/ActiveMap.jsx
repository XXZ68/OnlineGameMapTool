import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

// Update this to match your backend port
const BACKEND_URL = 'http://localhost:5089';

/**
 * ActiveMap Component
 *
 * Props:
 * - sessionId (string): UUID of the game session
 * - mapId (string): UUID of the active map to display
 * - currentUser (object):
 *     { playerId: string, playerName: string, isDungeonMaster: boolean, selectedCharacterId?: string }
 */
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

  // Derived loading state (No synchronous setState in effects needed!)
  const isLoading = !mapData || mapData.id !== mapId;

  // --- 2. FETCH INITIAL MAP DATA ON LOAD ---
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
        setError(null); // Reset errors safely inside the async callback
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

    // Token listeners
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

    // Grid listeners
    connection.on('GridUpdated', (updatedGrid) => {
      setGrid(updatedGrid);
    });

    // Spell listeners
    connection.on('SpellCasted', (spellEvent) => {
      setActiveSpells((prev) => [...prev, spellEvent]);
    });

    connection.on('SpellDismissed', (spellId) => {
      setActiveSpells((prev) => prev.filter((s) => s.id !== spellId && s.activeSpellId !== spellId));
    });

    // Start connection
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

  // --- 4. DRAG & DROP LOGIC ---
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

    const containerRect = mapContainerRef.current.getBoundingClientRect();
    const dropX = e.clientX - containerRect.left;
    const dropY = e.clientY - containerRect.top;

    const targetGridX = Math.floor((dropX - (grid.offsetX || 0)) / grid.cellSizeInPixels);
    const targetGridY = Math.floor((dropY - (grid.offsetY || 0)) / grid.cellSizeInPixels);

    // Optimistic local update
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, gridX: targetGridX, gridY: targetGridY } : t))
    );

    // Sync via SignalR Hub
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

  // --- 5. RENDER STATES ---
  if (error) {
    return <div style={{ color: '#ff6b6b', padding: '20px' }}>Error: {error}</div>;
  }

  if (isLoading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading Battle Map...</div>;
  }

  const cellSize = grid?.cellSizeInPixels || 50;

  return (
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
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      {/* --- GRID OVERLAY (SVG) --- */}
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

          {/* --- ACTIVE SPELL TEMPLATES (Uses activeSpells) --- */}
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
              cursor: draggable ? 'grab' : 'not-allowed',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              transition: 'transform 0.05s ease-out',
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
  );
}
