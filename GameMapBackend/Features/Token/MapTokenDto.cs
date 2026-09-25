namespace GameMapBackend.Features.Token;

public record MapTokenDto(
    Guid Id,
    Guid MapId,
    Guid? CharacterId,
    Guid? GameSessionId,
    string? MonsterIndex,
    string Name,
    string? TokenImageUrl,
    int GridX,
    int GridY,
    int SizeInCells,
    int CurrentHp,
    int MaxHp,
    int ArmorClass,
    bool IsVisibleToPlayers,
    bool IsLocked
);

public record PlaceCharacterTokenDto(
    Guid CharacterId,
    Guid GameSessionId,
    int GridX,
    int GridY
);

public record SpawnMonsterTokenDto(
    string MonsterIndex,
    Guid GameSessionId,
    int GridX,
    int GridY,
    string? CustomName = null
);

public record MoveTokenDto(
    int TargetGridX,
    int TargetGridY
);

public record UpdateTokenHpDto(
    int NewHp
);
