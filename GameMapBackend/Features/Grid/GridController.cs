using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using GameMapBackend.Hubs;

namespace GameMapBackend.Features.Grid;

/// <summary>
/// Manages battlemap grid overlay settings (cell size, color, offsets).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GridController : ControllerBase
{
    private readonly IGridService _gridService;
    private readonly IHubContext<MapHub, IMapClient> _hubContext;

    public GridController(IGridService gridService, IHubContext<MapHub, IMapClient> hubContext)
    {
        _gridService = gridService;
        _hubContext = hubContext;
    }

    /// <summary>
    /// Retrieves the current grid configuration for a given battlemap.
    /// </summary>
    /// <param name="mapId">The unique identifier of the map.</param>
    [HttpGet("map/{mapId:guid}")]
    public async Task<ActionResult<GridDto>> GetByMapId(Guid mapId)
    {
        var grid = await _gridService.GetGridByMapIdAsync(mapId);
        return grid == null ? NotFound() : Ok(grid);
    }

    /// <summary>
    /// Updates the grid dimensions, cell size, and offsets for a battlemap.
    /// </summary>
    /// <param name="mapId">The unique identifier of the map.</param>
    /// <param name="dto">The updated grid parameters.</param>
    /// <param name="sessionId">Optional session ID to broadcast changes to connected players.</param>
    [HttpPut("map/{mapId:guid}")]
    public async Task<ActionResult<GridDto>> UpdateGrid(Guid mapId, [FromBody] UpdateGridDto dto, [FromQuery] string? sessionId = null)
    {
        var updated = await _gridService.UpdateGridAsync(mapId, dto);
        if (updated == null) return NotFound();

        if (!string.IsNullOrEmpty(sessionId))
        {
            await _hubContext.Clients.Group(sessionId).GridUpdated(updated);
        }

        return Ok(updated);
    }
}
