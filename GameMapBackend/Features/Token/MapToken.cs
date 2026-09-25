using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GameMapBackend.Features.Character;
using GameMapBackend.Features.Map;

namespace GameMapBackend.Features.Token;

[Table("MapTokens")]
public class MapTokenEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid MapId { get; set; }

    [ForeignKey(nameof(MapId))]
    public MapEntity? Map { get; set; }

    public Guid? CharacterId { get; set; }
    public Guid GameSessionId { get; set; }

    [ForeignKey(nameof(CharacterId))]
    public CharacterEntity? Character { get; set; }

    public string? MonsterIndex { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? TokenImageUrl { get; set; }

    public int GridX { get; set; } = 0;
    public int GridY { get; set; } = 0;
    public int SizeInCells { get; set; } = 1;

    public int CurrentHp { get; set; }
    public int MaxHp { get; set; }
    public int ArmorClass { get; set; }

    public bool IsVisibleToPlayers { get; set; } = true;
    public bool IsLocked { get; set; } = false;

    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;
}
