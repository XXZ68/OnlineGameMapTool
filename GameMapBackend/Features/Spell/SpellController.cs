using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using GameMapBackend.Hubs;

namespace GameMapBackend.Features.Spell;

/// <summary>
/// Handles casting spells and managing active Area of Effect (AoE) templates.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SpellController : ControllerBase
{
    private readonly ISpellService _spellService;
    private readonly IHubContext<MapHub, IMapClient> _hubContext;

    public SpellController(ISpellService spellService, IHubContext<MapHub, IMapClient> hubContext)
    {
        _spellService = spellService;
        _hubContext = hubContext;
    }

    /// <summary>
    /// Retrieves all active persistent spell templates on the specified battlemap.
    /// </summary>
    /// <param name="mapId">The unique identifier of the map.</param>
    [HttpGet("map/{mapId:guid}/active")]
    public async Task<ActionResult<List<ActiveSpellDto>>> GetActiveSpells(Guid mapId) =>
        Ok(await _spellService.GetActiveSpellsByMapAsync(mapId));

    /// <summary>
    /// Casts a spell at target grid coordinates, calculating area of effect and concentration.
    /// </summary>
    /// <param name="mapId">The battlemap where the spell is cast.</param>
    /// <param name="dto">The spell casting details (spell index, target coords, caster token).</param>
    /// <param name="sessionId">Optional session ID to broadcast animations/templates to players.</param>
    [HttpPost("map/{mapId:guid}/cast")]
    public async Task<ActionResult<SpellCastEventDto>> CastSpell(
        Guid mapId, 
        [FromBody] CastSpellDto dto, 
        [FromQuery] string? sessionId = null)
    {
        var spellEvent = await _spellService.CastSpellAsync(mapId, dto);
        if (spellEvent == null)
        {
            return BadRequest("Zauber oder Zaubernder Charakter konnte nicht validiert werden.");
        }

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).SpellCasted(spellEvent);
        }

        return Ok(spellEvent);
    }

    /// <summary>
    /// Dismisses an active persistent spell effect from the map.
    /// </summary>
    /// <param name="id">The unique identifier of the active spell effect.</param>
    /// <param name="sessionId">Optional session ID to broadcast the removal.</param>
    [HttpDelete("active/{id:guid}")]
    public async Task<IActionResult> DismissActiveSpell(Guid id, [FromQuery] string? sessionId = null)
    {
        var success = await _spellService.DismissActiveSpellAsync(id);
        if (!success) return NotFound();

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).SpellDismissed(id);
        }

        return NoContent();
    }
}
