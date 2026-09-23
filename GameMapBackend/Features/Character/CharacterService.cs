using Microsoft.EntityFrameworkCore;
using GameMapBackend.Data;

namespace GameMapBackend.Features.Character;

public interface ICharacterService
{
    Task<List<CharacterDto>> GetCharactersBySessionAsync(Guid sessionId);
    Task<CharacterDto?> GetCharacterByIdAsync(Guid id);
    Task<CharacterDto> CreateCharacterAsync(CreateCharacterDto dto);
    Task<CharacterDto?> UpdateCharacterSheetAsync(Guid id, UpdateCharacterSheetDto dto);
    Task<bool> DeleteCharacterAsync(Guid id);
}

public class CharacterService : ICharacterService
{
    private readonly AppDbContext _context;

    public CharacterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CharacterDto>> GetCharactersBySessionAsync(Guid sessionId)
    {
        return await _context.Characters
            .AsNoTracking()
            .Where(c => c.GameSessionId == sessionId)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<CharacterDto?> GetCharacterByIdAsync(Guid id)
    {
        var entity = await _context.Characters.FindAsync(id);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<CharacterDto> CreateCharacterAsync(CreateCharacterDto dto)
    {
        var entity = new CharacterEntity
        {
            GameSessionId = dto.GameSessionId,
            Name = dto.Name,
            TokenImageUrl = dto.TokenImageUrl,
            OwnerPlayerId = dto.OwnerPlayerId,
            ClassIndex = dto.ClassIndex,
            RaceIndex = dto.RaceIndex,
            MaxHp = dto.MaxHp,
            CurrentHp = dto.MaxHp,
            ArmorClass = dto.ArmorClass,
            SpeedInFeet = dto.SpeedInFeet
        };

        _context.Characters.Add(entity);
        await _context.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<CharacterDto?> UpdateCharacterSheetAsync(Guid id, UpdateCharacterSheetDto dto)
    {
        var character = await _context.Characters.FindAsync(id);
        if (character == null) return null;

        character.Name = dto.Name;
        character.MaxHp = dto.MaxHp;
        character.ArmorClass = dto.ArmorClass;
        character.SpeedInFeet = dto.SpeedInFeet;

        await _context.SaveChangesAsync();
        return MapToDto(character);
    }

    public async Task<bool> DeleteCharacterAsync(Guid id)
    {
        var entity = await _context.Characters.FindAsync(id);
        if (entity == null) return false;

        _context.Characters.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static CharacterDto MapToDto(CharacterEntity c) => new(
        c.Id,
        c.GameSessionId,
        c.Name,
        c.TokenImageUrl,
        c.OwnerPlayerId,
        c.ClassIndex,
        c.RaceIndex,
        c.Level,
        c.MaxHp,
        c.CurrentHp,
        c.ArmorClass,
        c.SpeedInFeet
    );
}
