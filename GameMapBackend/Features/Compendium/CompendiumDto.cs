namespace GameMapBackend.Features.Compendium;

public record CompendiumSpellDto(string Index, string Name, int Level, string? Range, string? Duration, bool? Concentration);
public record CompendiumMonsterDto(string Index, string Name, string? Size, string? Type, int ArmorClass, int HitPoints, double ChallengeRating);
public record CompendiumClassDto(string Index, string Name, int HitDie);
public record CompendiumRaceDto(string Index, string Name, int Speed);
public record CompendiumConditionDto(string Index, string Name);
