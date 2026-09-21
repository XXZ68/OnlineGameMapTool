namespace GameMapBackend.Features.Character;

public record CharacterDto(
    Guid Id,
    Guid GameSessionId,
    string Name,
    string? TokenImageUrl,
    string OwnerPlayerId,
    string? ClassIndex,
    string? RaceIndex,
    int Level,
    int MaxHp,
    int CurrentHp,
    int ArmorClass,
    int SpeedInFeet
);

public record CreateCharacterDto(
    Guid GameSessionId,
    string Name,
    string? TokenImageUrl,
    string OwnerPlayerId,
    string? ClassIndex,
    string? RaceIndex,
    int MaxHp,
    int ArmorClass,
    int SpeedInFeet = 30
);

public record UpdateCharacterSheetDto(
    string Name,
    int MaxHp,
    int ArmorClass,
    int SpeedInFeet
);
