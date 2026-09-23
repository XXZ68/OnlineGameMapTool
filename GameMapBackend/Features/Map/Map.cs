using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GameMapBackend.Features.Grid;
using GameMapBackend.Features.Spell;
using GameMapBackend.Features.Token;

namespace GameMapBackend.Features.Map;

[Table("Maps")]
public class MapEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    public int WidthInPixels { get; set; }
    public int HeightInPixels { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public GridEntity? Grid { get; set; }
    public List<MapTokenEntity> Tokens { get; set; } = new();
    public List<ActiveSpellEffectEntity> ActiveSpells { get; set; } = new();
}
