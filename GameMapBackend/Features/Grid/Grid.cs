using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GameMapBackend.Features.Map;

namespace GameMapBackend.Features.Grid;

[Table("Grids")]
public class GridEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid MapId { get; set; }

    [ForeignKey(nameof(MapId))]
    public MapEntity? Map { get; set; }

    public int CellSizeInPixels { get; set; } = 70;
    public int Columns { get; set; } = 28;
    public int Rows { get; set; } = 28;

    [MaxLength(20)]
    public string LineColor { get; set; } = "#000000";
    public double LineOpacity { get; set; } = 0.4;

    public int OffsetX { get; set; } = 0;
    public int OffsetY { get; set; } = 0;
}
