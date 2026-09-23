using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GameMapBackend.Features.Map;

namespace GameMapBackend.Features.Spell;

[Table("ActiveSpellEffects")]
public class ActiveSpellEffectEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid MapId { get; set; }

    [ForeignKey(nameof(MapId))]
    public MapEntity? Map { get; set; }

    [Required]
    public string SpellIndex { get; set; } = string.Empty;

    [Required]
    public string SpellName { get; set; } = string.Empty;

    public Guid? CasterCharacterId { get; set; }

    public int OriginGridX { get; set; }
    public int OriginGridY { get; set; }
    public int RadiusInCells { get; set; } = 1;

    [MaxLength(50)]
    public string Shape { get; set; } = "Sphere";

    [MaxLength(20)]
    public string ColorHex { get; set; } = "#FF5722";

    public bool RequiresConcentration { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
