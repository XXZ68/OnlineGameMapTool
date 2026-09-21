using Microsoft.AspNetCore.Mvc;

namespace GameMapBackend.Features.Compendium;

/// <summary>
/// Provides read-only access to standard D&amp;D 5e SRD rules, classes, races, monsters, and spells.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CompendiumController : ControllerBase
{
    private readonly ICompendiumService _compendiumService;

    public CompendiumController(ICompendiumService compendiumService)
    {
        _compendiumService = compendiumService;
    }

    /// <summary>
    /// Retrieves all available D&amp;D classes for character creation.
    /// </summary>
    [HttpGet("classes")]
    public async Task<ActionResult<List<CompendiumClassDto>>> GetClasses() =>
        Ok(await _compendiumService.GetClassesAsync());

    /// <summary>
    /// Retrieves all available D&amp;D races for character creation.
    /// </summary>
    [HttpGet("races")]
    public async Task<ActionResult<List<CompendiumRaceDto>>> GetRaces() =>
        Ok(await _compendiumService.GetRacesAsync());

    /// <summary>
    /// Searches spells by name filter and optional spell level.
    /// </summary>
    /// <param name="query">Optional search text for the spell name.</param>
    /// <param name="level">Optional spell level filter (0-9).</param>
    [HttpGet("spells")]
    public async Task<ActionResult<List<CompendiumSpellDto>>> SearchSpells([FromQuery] string? query = null, [FromQuery] int? level = null) =>
        Ok(await _compendiumService.SearchSpellsAsync(query, level));

    /// <summary>
    /// Searches monsters by name filter.
    /// </summary>
    /// <param name="query">Optional search text for the monster name.</param>
    [HttpGet("monsters")]
    public async Task<ActionResult<List<CompendiumMonsterDto>>> SearchMonsters([FromQuery] string? query = null) =>
        Ok(await _compendiumService.SearchMonstersAsync(query));

    /// <summary>
    /// Retrieves all standard D&amp;D conditions.
    /// </summary>
    [HttpGet("conditions")]
    public async Task<ActionResult<List<CompendiumConditionDto>>> GetConditions() =>
        Ok(await _compendiumService.GetConditionsAsync());
}
