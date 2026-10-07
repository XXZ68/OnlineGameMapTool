import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5089';

// Subcomponent: Using key={selectedToken.id} resets state on token switch with NO useEffect needed!
function TokenInspector({ token, sessionId, onClose, onHpChanged, onTokenDeleted }) {
  const [hp, setHp] = useState(token.currentHp);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveHp = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = new URL(`${BACKEND_URL}/api/Token/${token.id}/hp`);
      if (sessionId) url.searchParams.append('sessionId', sessionId);

      const res = await fetch(url.toString(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newHp: Number(hp) }),
      });
      if (res.ok && onHpChanged) {
        onHpChanged(token.id, Number(hp));
      }
    } catch (err) {
      console.error('Failed to update HP:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const url = new URL(`${BACKEND_URL}/api/Token/${token.id}`);
      if (sessionId) url.searchParams.append('sessionId', sessionId);

      const res = await fetch(url.toString(), { method: 'DELETE' });
      if (res.ok) {
        if (onTokenDeleted) onTokenDeleted(token.id);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error('Failed to remove token:', err);
    }
  };

  return (
    <div style={{ padding: '14px', borderTop: '1px solid #333', background: '#141414' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#e0a96d', fontSize: '14px' }}>{token.name}</strong>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
      <div style={{ fontSize: '11px', color: '#888', margin: '4px 0 10px 0' }}>
        Pos: ({token.gridX}, {token.gridY}) | Size: {token.sizeInCells}x{token.sizeInCells}
      </div>

      <form onSubmit={handleSaveHp} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '12px' }}>HP:</span>
        <input
          type="number"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          style={{
            width: '60px',
            padding: '4px 6px',
            background: '#111',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <span style={{ color: '#666', fontSize: '12px' }}>/ {token.maxHp}</span>
        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: '5px 10px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {isSaving ? '...' : 'Save'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '6px',
          background: '#7f1d1d',
          color: '#fca5a5',
          border: '1px solid #991b1b',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Remove from Board
      </button>
    </div>
  );
}

export default function TokenBox({
  sessionId,
  selectedToken,
  onCloseInspector,
  onHpChanged,
  onTokenDeleted,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('monsters');
  const [searchQuery, setSearchQuery] = useState('');
  const [monsters, setMonsters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. SRD Monsters search: setLoading is called inside the async debounce callback
  useEffect(() => {
    if (activeTab !== 'monsters') return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/Compendium/monsters?query=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Failed to fetch monsters');
        const data = await res.json();
        setMonsters(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, activeTab]);

  // 2. Fetch Characters: Avoid synchronous setState in effect body by wrapping in an async task
  useEffect(() => {
    if (activeTab !== 'characters' || !sessionId) return;

    const controller = new AbortController();

    async function loadCharacters() {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/Character/session/${sessionId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch session characters');
        const data = await res.json();
        setCharacters(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Queue fetch asynchronously to satisfy React 19 cascading render rules
    const id = setTimeout(loadCharacters, 0);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [sessionId, activeTab]);

  const handleDragMonsterStart = (e, monster) => {
    e.dataTransfer.setData(
      'application/vtt-spawn-monster',
      JSON.stringify({
        monsterIndex: monster.index,
        name: monster.name,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragCharacterStart = (e, character) => {
    e.dataTransfer.setData(
      'application/vtt-place-character',
      JSON.stringify({
        characterId: character.id,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  const isDrawerOpen = isOpen || Boolean(selectedToken);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        background: '#1a1a1a',
        borderLeft: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '-4px 0 15px rgba(0,0,0,0.6)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          left: '-36px',
          top: '20px',
          width: '36px',
          height: '42px',
          background: '#1a1a1a',
          color: '#e0a96d',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
        title="Toggle TokenBox"
      >
        {isDrawerOpen ? '▶' : '🧰'}
      </button>

      {/* Header */}
      <div style={{ padding: '14px', borderBottom: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f5f5f5', fontSize: '15px' }}>GM TokenBox</h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('monsters')}
            style={activeTab === 'monsters' ? activeTabStyle : inactiveTabStyle}
          >
            SRD Monsters
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            style={activeTab === 'characters' ? activeTabStyle : inactiveTabStyle}
          >
            Characters
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {activeTab === 'monsters' && (
          <>
            <input
              type="text"
              placeholder="Search monsters (e.g. Goblin, Dragon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
            />
            {loading && <div style={subtextStyle}>Searching SRD...</div>}
            {!loading && monsters.length === 0 && (
              <div style={subtextStyle}>No monsters found.</div>
            )}
            {monsters.map((monster) => (
              <div
                key={monster.index}
                draggable
                onDragStart={(e) => handleDragMonsterStart(e, monster)}
                style={itemCardStyle}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#fff' }}>{monster.name}</strong>
                  <span style={badgeStyle}>CR {monster.challengeRating}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Size: {monster.size} | AC: {monster.armorClass} | HP: {monster.hitPoints}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'characters' && (
          <>
            {characters.length === 0 ? (
              <div style={subtextStyle}>No characters registered in session.</div>
            ) : (
              characters.map((char) => (
                <div
                  key={char.id}
                  draggable
                  onDragStart={(e) => handleDragCharacterStart(e, char)}
                  style={itemCardStyle}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fff' }}>{char.name}</strong>
                    <span style={badgeStyle}>Lvl {char.level}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                    HP: {char.currentHp}/{char.maxHp} | AC: {char.armorClass}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Inspector using key prop to avoid any useEffect cascading render */}
      {selectedToken && (
        <TokenInspector
          key={selectedToken.id}
          token={selectedToken}
          sessionId={sessionId}
          onClose={onCloseInspector}
          onHpChanged={onHpChanged}
          onTokenDeleted={onTokenDeleted}
        />
      )}
    </div>
  );
}

const activeTabStyle = {
  flex: 1,
  padding: '6px',
  background: '#e0a96d',
  color: '#1a1a1a',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '12px',
  cursor: 'pointer',
};

const inactiveTabStyle = {
  flex: 1,
  padding: '6px',
  background: '#2b2b2b',
  color: '#aaa',
  border: '1px solid #444',
  borderRadius: '4px',
  fontSize: '12px',
  cursor: 'pointer',
};

const inputStyle = {
  width: '100%',
  padding: '7px 9px',
  background: '#111',
  border: '1px solid #444',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '12px',
  marginBottom: '10px',
  boxSizing: 'border-box',
};

const itemCardStyle = {
  padding: '8px 10px',
  marginBottom: '8px',
  background: '#252525',
  border: '1px solid #383838',
  borderRadius: '4px',
  cursor: 'grab',
  userSelect: 'none',
};

const badgeStyle = {
  fontSize: '10px',
  background: '#333',
  color: '#e0a96d',
  padding: '2px 5px',
  borderRadius: '3px',
};

const subtextStyle = {
  fontSize: '12px',
  color: '#666',
  textAlign: 'center',
  padding: '20px 0',
};
