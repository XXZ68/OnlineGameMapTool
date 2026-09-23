using Microsoft.EntityFrameworkCore;
using GameMapBackend.Data;

namespace GameMapBackend.Features.GameSession;

public interface IGameSessionService
{
    Task<GameSessionDto> CreateSessionAsync(CreateSessionDto dto);
    Task<GameSessionDto?> GetSessionByIdAsync(Guid sessionId);
    Task<GameSessionDto?> JoinSessionAsync(JoinSessionDto dto);
    Task<bool> SwitchActiveMapAsync(Guid sessionId, Guid newMapId);
}

public class GameSessionService : IGameSessionService
{
    private readonly AppDbContext _context;

    public GameSessionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GameSessionDto> CreateSessionAsync(CreateSessionDto dto)
    {
        var joinCode = GenerateJoinCode();

        var session = new GameSessionEntity
        {
            SessionName = dto.SessionName,
            DungeonMasterId = dto.DungeonMasterId,
            JoinCode = joinCode,
            ActiveMapId = dto.InitialMapId
        };

        session.Participants.Add(new SessionParticipantEntity
        {
            PlayerId = dto.DungeonMasterId,
            PlayerName = dto.DungeonMasterName,
            IsDungeonMaster = true
        });

        _context.GameSessions.Add(session);
        await _context.SaveChangesAsync();

        return MapToDto(session);
    }

    public async Task<GameSessionDto?> GetSessionByIdAsync(Guid sessionId)
    {
        var session = await _context.GameSessions
            .AsNoTracking()
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        return session == null ? null : MapToDto(session);
    }

    public async Task<GameSessionDto?> JoinSessionAsync(JoinSessionDto dto)
    {
        var session = await _context.GameSessions
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.JoinCode.ToUpper() == dto.JoinCode.ToUpper());

        if (session == null) return null;

        var existing = session.Participants.FirstOrDefault(p => p.PlayerId == dto.PlayerId);
        if (existing == null)
        {
            session.Participants.Add(new SessionParticipantEntity
            {
                GameSessionId = session.Id,
                PlayerId = dto.PlayerId,
                PlayerName = dto.PlayerName,
                SelectedCharacterId = dto.CharacterId,
                IsDungeonMaster = false
            });
            await _context.SaveChangesAsync();
        }

        return MapToDto(session);
    }

    public async Task<bool> SwitchActiveMapAsync(Guid sessionId, Guid newMapId)
    {
        var session = await _context.GameSessions.FindAsync(sessionId);
        if (session == null) return false;

        session.ActiveMapId = newMapId;
        await _context.SaveChangesAsync();
        return true;
    }

    private static string GenerateJoinCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    private static GameSessionDto MapToDto(GameSessionEntity s) => new(
        s.Id,
        s.SessionName,
        s.JoinCode,
        s.DungeonMasterId,
        s.ActiveMapId,
        s.Participants.Select(p => new ParticipantDto(
            p.Id,
            p.PlayerId,
            p.PlayerName,
            p.SelectedCharacterId,
            p.IsDungeonMaster
        )).ToList()
    );
}
