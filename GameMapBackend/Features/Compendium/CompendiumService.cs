using Microsoft.EntityFrameworkCore;
using GameMapBackend.Data;

namespace GameMapBackend.Features.Compendium;

public interface ICompendiumService
{
    Task<List<CompendiumClassDto>> GetClassesAsync();
    Task<List<CompendiumRaceDto>> GetRacesAsync();
    Task<List<CompendiumSpellDto>> SearchSpellsAsync(string? query, int? level = null);
    Task<List<CompendiumMonsterDto>> SearchMonstersAsync(string? query);
    Task<List<CompendiumConditionDto>> GetConditionsAsync();
}

public class CompendiumService : ICompendiumService
{
    private readonly AppDbContext _context;

    public CompendiumService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompendiumClassDto>> GetClassesAsync() =>
        await _context.Classes.AsNoTracking().Select(c => new CompendiumClassDto(c.Index, c.Name, c.HitDie)).ToListAsync();

    public async Task<List<CompendiumRaceDto>> GetRacesAsync() =>
        await _context.Races.AsNoTracking().Select(r => new CompendiumRaceDto(r.Index, r.Name, r.Speed)).ToListAsync();

    public async Task<List<CompendiumSpellDto>> SearchSpellsAsync(string? query, int? level = null)
    {
        var q = _context.Spells.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query)) q = q.Where(s => s.Name.ToLower().Contains(query.ToLower()));
        if (level.HasValue) q = q.Where(s => s.Level == level.Value);

        return await q.Take(50).Select(s => new CompendiumSpellDto(s.Index, s.Name, s.Level, s.Range, s.Duration, s.Concentration)).ToListAsync();
    }

    public async Task<List<CompendiumMonsterDto>> SearchMonstersAsync(string? query)
    {
        var q = _context.Monsters.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query)) q = q.Where(m => m.Name.ToLower().Contains(query.ToLower()));

        return await q.Take(50).Select(m => new CompendiumMonsterDto(m.Index, m.Name, m.Size, m.Type, m.ArmorClass, m.HitPoints, m.ChallengeRating)).ToListAsync();
    }

    public async Task<List<CompendiumConditionDto>> GetConditionsAsync() =>
        await _context.Conditions.AsNoTracking().Select(c => new CompendiumConditionDto(c.Index, c.Name)).ToListAsync();
}
