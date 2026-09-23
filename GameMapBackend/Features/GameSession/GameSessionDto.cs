namespace GameMapBackend.Features.GameSession;

public record GameSessionDto(
    Guid Id,
    string SessionName,
    string JoinCode,
    string DungeonMasterId,
    Guid? ActiveMapId,
    List<ParticipantDto> Participants
);

public record ParticipantDto(
    Guid Id,
    string PlayerId,
    string PlayerName,
    Guid? SelectedCharacterId,
    bool IsDungeonMaster
);

public record CreateSessionDto(
    string SessionName,
    string DungeonMasterId,
    string DungeonMasterName,
    Guid? InitialMapId = null
);

public record JoinSessionDto(
    string JoinCode,
    string PlayerId,
    string PlayerName,
    Guid? CharacterId = null
);
