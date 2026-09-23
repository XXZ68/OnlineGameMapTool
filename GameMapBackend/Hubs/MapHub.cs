using Microsoft.AspNetCore.SignalR;
using GameMapBackend.Features.Grid;
using GameMapBackend.Features.Spell;
using GameMapBackend.Features.Token;

namespace GameMapBackend.Hubs;

/// <summary>
/// Real-time SignalR Hub managing live multiplayer synchronization across battlemaps and sessions.
/// </summary>
public class MapHub : Hub<IMapClient>
{
    private readonly ITokenService _tokenService;
    private readonly IGridService _gridService;
    private readonly ISpellService _spellService;

    public MapHub(
        ITokenService tokenService,
        IGridService gridService,
        ISpellService spellService)
    {
        _tokenService = tokenService;
        _gridService = gridService;
        _spellService = spellService;
    }

    /// <summary>
    /// Joins a specific game session room and informs other participants.
    /// </summary>
    /// <param name="sessionId">The session identifier used as the SignalR group name.</param>
    /// <param name="playerId">The user ID of the joining player.</param>
    /// <param name="playerName">The display name of the joining player.</param>
    public async Task JoinSession(string sessionId, string playerId, string playerName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await Clients.OthersInGroup(sessionId).PlayerJoined(playerId, playerName);
    }

    /// <summary>
    /// Leaves a game session room and notifies remaining participants.
    /// </summary>
    /// <param name="sessionId">The session identifier.</param>
    /// <param name="playerId">The user ID of the disconnecting player.</param>
    public async Task LeaveSession(string sessionId, string playerId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        await Clients.OthersInGroup(sessionId).PlayerLeft(playerId);
    }

    /// <summary>
    /// Moves a token to new grid coordinates and broadcasts the new position in real time.
    /// </summary>
    /// <param name="sessionId">The session identifier.</param>
    /// <param name="tokenId">The unique identifier of the token.</param>
    /// <param name="targetX">Target column coordinate on the grid.</param>
    /// <param name="targetY">Target row coordinate on the grid.</param>
    public async Task MoveToken(string sessionId, Guid tokenId, int targetX, int targetY)
    {
        var updated = await _tokenService.MoveTokenAsync(tokenId, targetX, targetY);
        if (updated != null)
        {
            await Clients.Group(sessionId).TokenMoved(tokenId, targetX, targetY);
        }
    }

    /// <summary>
    /// Triggers a spell cast, calculates areas/concentration, and broadcasts the event.
    /// </summary>
    /// <param name="sessionId">The session identifier.</param>
    /// <param name="mapId">The battlemap identifier.</param>
    /// <param name="dto">The spell cast parameters.</param>
    public async Task CastSpell(string sessionId, Guid mapId, CastSpellDto dto)
    {
        var spellEvent = await _spellService.CastSpellAsync(mapId, dto);
        if (spellEvent != null)
        {
            await Clients.Group(sessionId).SpellCasted(spellEvent);
        }
    }

    /// <summary>
    /// Modifies grid parameters (offsets, opacity, size) and broadcasts the updated grid.
    /// </summary>
    /// <param name="sessionId">The session identifier.</param>
    /// <param name="mapId">The battlemap identifier.</param>
    /// <param name="dto">The updated grid properties.</param>
    public async Task UpdateGrid(string sessionId, Guid mapId, UpdateGridDto dto)
    {
        var updatedGrid = await _gridService.UpdateGridAsync(mapId, dto);
        if (updatedGrid != null)
        {
            await Clients.Group(sessionId).GridUpdated(updatedGrid);
        }
    }
}
