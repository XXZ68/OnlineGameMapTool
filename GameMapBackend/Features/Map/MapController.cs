using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;

namespace GameMapBackend.Features.Map;

/// <summary>
/// Manages battlemaps, file uploads, and map data retrieval.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MapController : ControllerBase
{
    private readonly IMapService _mapService;

    public MapController(IMapService mapService)
    {
        _mapService = mapService;
    }

    /// <summary>
    /// Retrieves a list of all uploaded maps (summary metadata).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<MapSummaryDto>>> GetAll() =>
        Ok(await _mapService.GetAllMapsAsync());

    /// <summary>
    /// Retrieves full map details including its grid, tokens, and active spells.
    /// </summary>
    /// <param name="id">The unique identifier of the map.</param>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MapDetailDto>> GetById(Guid id)
    {
        var map = await _mapService.GetMapByIdAsync(id);
        return map == null ? NotFound() : Ok(map);
    }

    /// <summary>
    /// Uploads a new battlemap image file and generates its default grid configuration.
    /// </summary>
    /// <param name="dto">The map creation data (title and initial cell size).</param>
    /// initial cell size >= 0
    /// <param name="image">The image file upload (PNG/JPG/WebP).</param>
    /// image would theoretically also be accepted as TIFF because image sharp accepts this as valid
    /// Could fix this by reading metadata
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<MapDetailDto>> Create([FromForm] CreateMapDto dto, IFormFile image)
    {   
        var allowedExtensions = new[] { ".jpg", ".png", ".webp"};

        if (image == null || image.Length == 0)
            {
                return BadRequest("Bitte lade eine Bilddatei für die Battlemap hoch.");
            }
        if (image.Length > 20 * 1024 * 1024) // 20MB
            {
                return BadRequest("Datei ist zu groß. Bitte lade eine Datei hoch die nicht größer als 20MB ist.");
            }

        string fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Bitte lade einen gültigen Dateityp (.jpg, .png, webp) für die Battlemap hoch.");
            }
        
        if (dto.InitialCellSize <= 0)
        {
            return BadRequest("Die Zellengröße muss größer als 0 sein.");
        }

        try
        {
            await using var stream = image.OpenReadStream();
            var imageInfo = await Image.IdentifyAsync(stream);

            if (imageInfo is null)
                return BadRequest("Ungültiges Bild.");
        }
        catch (UnknownImageFormatException)
        {
            return BadRequest("Nicht unterstütztes Bildformat.");
        }
        catch (InvalidImageContentException)
        {
            return BadRequest("Beschädigtes Bild.");
        }



        var created = await _mapService.CreateMapAsync(dto, image);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Deletes a battlemap and cascades the removal of its grid, tokens, and spells.
    /// </summary>
    /// <param name="id">The unique identifier of the map.</param>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _mapService.DeleteMapAsync(id);
        return success ? NoContent() : NotFound();
    }
}
