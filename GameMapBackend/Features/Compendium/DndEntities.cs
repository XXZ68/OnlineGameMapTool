using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameMapBackend.Features.Compendium;

[Table("dnd_spells")]
public class DndSpellEntity
{
    [Key]
    [Column("index")]
    public string Index { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("level")]
    public int Level { get; set; }

    [Column("range")]
    public string? Range { get; set; }

    [Column("duration")]
    public string? Duration { get; set; }

    [Column("concentration")]
    public bool? Concentration { get; set; }
}

[Table("dnd_monsters")]
public class DndMonsterEntity
{
    [Key]
    [Column("index")]
    public string Index { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("size")]
    public string? Size { get; set; }

    [Column("type")]
    public string? Type { get; set; }

    [Column("armor_class")]
    public int ArmorClass { get; set; }

    [Column("hit_points")]
    public int HitPoints { get; set; }

    [Column("challenge_rating")]
    public double ChallengeRating { get; set; }
}

[Table("dnd_classes")]
public class DndClassEntity
{
    [Key]
    [Column("index")]
    public string Index { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("hit_die")]
    public int HitDie { get; set; }
}

[Table("dnd_races")]
public class DndRaceEntity
{
    [Key]
    [Column("index")]
    public string Index { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("speed")]
    public int Speed { get; set; }
}

[Table("dnd_conditions")]
public class DndConditionEntity
{
    [Key]
    [Column("index")]
    public string Index { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;
}
