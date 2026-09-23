namespace GameMapBackend.Features.Spell;

public record CastSpellDto(
    string SpellIndex,
    Guid? CasterTokenId,
    int TargetGridX,
    int TargetGridY,
    int? CustomRadiusFeet = null
);

public record SpellCastEventDto(
    Guid EventId,
    Guid MapId,
    string SpellIndex,
    string SpellName,
    int TargetGridX,
    int TargetGridY,
    int RadiusInCells,
    string AreaShape,
    string ColorHex,
    bool IsPersistent,
    Guid? ActiveSpellId
);

public record ActiveSpellDto(
    Guid Id,
    Guid MapId,
    string SpellIndex,
    string SpellName,
    int OriginGridX,
    int OriginGridY,
    int RadiusInCells,
    string Shape,
    string ColorHex,
    bool RequiresConcentration,
    Guid? CasterCharacterId
);
