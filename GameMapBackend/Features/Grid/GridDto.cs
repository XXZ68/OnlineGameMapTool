namespace GameMapBackend.Features.Grid;

public record GridDto(
    Guid Id,
    Guid MapId,
    int CellSizeInPixels,
    int Columns,
    int Rows,
    string LineColor,
    double LineOpacity,
    int OffsetX,
    int OffsetY
);

public record UpdateGridDto(
    int CellSizeInPixels,
    string LineColor,
    double LineOpacity,
    int OffsetX,
    int OffsetY
);
