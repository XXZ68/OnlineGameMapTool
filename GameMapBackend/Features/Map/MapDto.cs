using GameMapBackend.Features.Grid;
using GameMapBackend.Features.Spell;
using GameMapBackend.Features.Token;

namespace GameMapBackend.Features.Map;

public record MapSummaryDto(
    Guid Id,
    string Title,
    string ImageUrl,
    int WidthInPixels,
    int HeightInPixels,
    DateTime CreatedAt
);

public record MapDetailDto(
    Guid Id,
    string Title,
    string ImageUrl,
    int WidthInPixels,
    int HeightInPixels,
    GridDto? Grid,
    List<MapTokenDto> Tokens,
    List<ActiveSpellDto> ActiveSpells
);

public record CreateMapDto(
    string Title,
    int InitialCellSize = 70
);
