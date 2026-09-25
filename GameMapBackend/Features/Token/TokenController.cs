using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using GameMapBackend.Hubs;

namespace GameMapBackend.Features.Token;

/// <summary>
/// Manages tokens placed on the battlemap (PCs and monsters) and their movements.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TokenController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly IHubContext<MapHub, IMapClient> _hubContext;

    public TokenController(ITokenService tokenService, IHubContext<MapHub, IMapClient> hubContext)
    {
        _tokenService = tokenService;
        _hubContext = hubContext;
    }

    /// <summary>
    /// Retrieves all active tokens currently placed on the specified battlemap.
    /// </summary>
    /// <param name="mapId">The unique identifier of the map.</param>
    /// <param name="sessionId">The unique identifier of the game session.</param>
    [HttpGet("map/{mapId:guid}")]
    public async Task<ActionResult<List<MapTokenDto>>> GetByMap(Guid mapId, [FromQuery] Guid sessionId) =>
        Ok(await _tokenService.GetTokensByMapAsync(mapId, sessionId));

    /// <summary>
    /// Places a player character token onto the battlemap at the specified grid position.
    /// </summary>
    /// <param name="mapId">The unique identifier of the target map.</param>
    /// <param name="dto">The placement data including the CharacterId and coordinates.</param>
    /// <param name="sessionId">Optional session ID to broadcast real-time updates.</param>
    [HttpPost("map/{mapId:guid}/place-character")]
    public async Task<ActionResult<MapTokenDto>> PlaceCharacter(
        Guid mapId, 
        [FromBody] PlaceCharacterTokenDto dto, 
        [FromQuery] string? sessionId = null)
    {
        var token = await _tokenService.PlaceCharacterTokenAsync(mapId, dto);
        if (token == null) return BadRequest("Charakter wurde nicht gefunden.");

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).TokenSpawned(token);
        }

        return Ok(token);
    }

    /// <summary>
    /// Spawns a monster token onto the battlemap from the D&amp;D SRD compendium.
    /// </summary>
    /// <param name="mapId">The unique identifier of the target map.</param>
    /// <param name="dto">Monster index and target grid coordinates.</param>
    /// <param name="sessionId">Optional session ID to broadcast real-time updates.</param>
    [HttpPost("map/{mapId:guid}/spawn-monster")]
    public async Task<ActionResult<MapTokenDto>> SpawnMonster(
        Guid mapId, 
        [FromBody] SpawnMonsterTokenDto dto, 
        [FromQuery] string? sessionId = null)
    {
        var token = await _tokenService.SpawnMonsterTokenAsync(mapId, dto);
        if (token == null) return BadRequest("Monster nicht in D&D Datenbank gefunden.");

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).TokenSpawned(token);
        }

        return Ok(token);
    }

    /// <summary>
    /// Moves an existing token to a new grid position.
    /// </summary>
    /// <param name="id">The unique identifier of the token.</param>
    /// <param name="dto">The target grid coordinates.</param>
    /// <param name="sessionId">Optional session ID to broadcast real-time updates.</param>
    [HttpPatch("{id:guid}/move")]
    public async Task<ActionResult<MapTokenDto>> Move(
        Guid id, 
        [FromBody] MoveTokenDto dto, 
        [FromQuery] string? sessionId = null)
    {
        var updated = await _tokenService.MoveTokenAsync(id, dto.TargetGridX, dto.TargetGridY);
        if (updated == null) return NotFound("Token nicht gefunden oder gesperrt.");

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).TokenMoved(id, dto.TargetGridX, dto.TargetGridY);
        }

        return Ok(updated);
    }

    /// <summary>
    /// Updates the current Hit Points (HP) of a token on the board.
    /// </summary>
    /// <param name="id">The unique identifier of the token.</param>
    /// <param name="dto">The new HP value.</param>
    /// <param name="sessionId">Optional session ID to broadcast real-time updates.</param>
    [HttpPatch("{id:guid}/hp")]
    public async Task<ActionResult<MapTokenDto>> UpdateHp(
        Guid id, 
        [FromBody] UpdateTokenHpDto dto, 
        [FromQuery] string? sessionId = null)
    {
        var updated = await _tokenService.UpdateHpAsync(id, dto.NewHp);
        if (updated == null) return NotFound();

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).TokenHpChanged(id, dto.NewHp);
        }

        return Ok(updated);
    }

    /// <summary>
    /// Removes a token permanently from the battlemap.
    /// </summary>
    /// <param name="id">The unique identifier of the token.</param>
    /// <param name="sessionId">Optional session ID to broadcast real-time updates.</param>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] string? sessionId = null)
    {
        var success = await _tokenService.DeleteTokenAsync(id);
        if (!success) return NotFound();

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).TokenRemoved(id);
        }

        return NoContent();
    }
}
