using Microsoft.AspNetCore.Mvc;

namespace GameMapBackend.Features.Character;

/// <summary>
/// Manages campaign characters and player character sheets.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CharacterController : ControllerBase
{
    private readonly ICharacterService _characterService;

    public CharacterController(ICharacterService characterService)
    {
        _characterService = characterService;
    }

    /// <summary>
    /// Retrieves all characters created within a specific game session.
    /// </summary>
    /// <param name="sessionId">The unique identifier of the game session.</param>
    [HttpGet("session/{sessionId:guid}")]
    public async Task<ActionResult<List<CharacterDto>>> GetBySession(Guid sessionId) =>
        Ok(await _characterService.GetCharactersBySessionAsync(sessionId));

    /// <summary>
    /// Retrieves a character sheet by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the character.</param>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CharacterDto>> GetById(Guid id)
    {
        var character = await _characterService.GetCharacterByIdAsync(id);
        return character == null ? NotFound() : Ok(character);
    }

    /// <summary>
    /// Creates a new character for a game session.
    /// </summary>
    /// <param name="dto">The initial character configuration data.</param>
    [HttpPost]
    public async Task<ActionResult<CharacterDto>> Create([FromBody] CreateCharacterDto dto)
    {
        var created = await _characterService.CreateCharacterAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing character sheet (e.g., stats, Max HP, AC).
    /// </summary>
    /// <param name="id">The unique identifier of the character.</param>
    /// <param name="dto">The updated sheet values.</param>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CharacterDto>> UpdateSheet(Guid id, [FromBody] UpdateCharacterSheetDto dto)
    {
        var updated = await _characterService.UpdateCharacterSheetAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    /// <summary>
    /// Permanently deletes a character from the campaign.
    /// </summary>
    /// <param name="id">The unique identifier of the character.</param>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _characterService.DeleteCharacterAsync(id);
        return success ? NoContent() : NotFound();
    }
}
