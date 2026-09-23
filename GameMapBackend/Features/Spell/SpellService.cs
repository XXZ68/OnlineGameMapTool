using Microsoft.EntityFrameworkCore;
using GameMapBackend.Data;

namespace GameMapBackend.Features.Spell;

public interface ISpellService
{
    Task<List<ActiveSpellDto>> GetActiveSpellsByMapAsync(Guid mapId);
    Task<SpellCastEventDto?> CastSpellAsync(Guid mapId, CastSpellDto dto);
    Task<bool> DismissActiveSpellAsync(Guid activeSpellId);
}

public class SpellService : ISpellService
{
    private readonly AppDbContext _context;

    public SpellService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ActiveSpellDto>> GetActiveSpellsByMapAsync(Guid mapId)
    {
        return await _context.ActiveSpellEffects
            .AsNoTracking()
            .Where(s => s.MapId == mapId)
            .Select(s => new ActiveSpellDto(
                s.Id,
                s.MapId,
                s.SpellIndex,
                s.SpellName,
                s.OriginGridX,
                s.OriginGridY,
                s.RadiusInCells,
                s.Shape,
                s.ColorHex,
                s.RequiresConcentration,
                s.CasterCharacterId
            ))
            .ToListAsync();
    }

    public async Task<SpellCastEventDto?> CastSpellAsync(Guid mapId, CastSpellDto dto)
    {
        var spell = await _context.Spells
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Index == dto.SpellIndex.ToLower());

        if (spell == null) return null;

        Guid? characterId = null;
        if (dto.CasterTokenId.HasValue)
        {
            var token = await _context.MapTokens.FindAsync(dto.CasterTokenId.Value);
            characterId = token?.CharacterId;
        }

        int radiusFeet = dto.CustomRadiusFeet ?? 20;
        int radiusInCells = Math.Max(1, radiusFeet / 5);
        bool requiresConcentration = spell.Concentration ?? false;

        bool isPersistent = requiresConcentration || (spell.Duration != null && !spell.Duration.ToLower().Contains("instant"));
        Guid? activeSpellId = null;

        if (isPersistent)
        {
            if (requiresConcentration && characterId.HasValue)
            {
                var priorSpells = await _context.ActiveSpellEffects
                    .Where(a => a.CasterCharacterId == characterId.Value && a.RequiresConcentration)
                    .ToListAsync();
                _context.ActiveSpellEffects.RemoveRange(priorSpells);
            }

            var activeEntity = new ActiveSpellEffectEntity
            {
                MapId = mapId,
                SpellIndex = spell.Index,
                SpellName = spell.Name,
                CasterCharacterId = characterId,
                OriginGridX = dto.TargetGridX,
                OriginGridY = dto.TargetGridY,
                RadiusInCells = radiusInCells,
                Shape = "Sphere",
                ColorHex = "#FF5722",
                RequiresConcentration = requiresConcentration
            };

            _context.ActiveSpellEffects.Add(activeEntity);
            await _context.SaveChangesAsync();
            activeSpellId = activeEntity.Id;
        }

        return new SpellCastEventDto(
            Guid.NewGuid(),
            mapId,
            spell.Index,
            spell.Name,
            dto.TargetGridX,
            dto.TargetGridY,
            radiusInCells,
            "Sphere",
            "#FF5722",
            isPersistent,
            activeSpellId
        );
    }

    public async Task<bool> DismissActiveSpellAsync(Guid activeSpellId)
    {
        var spell = await _context.ActiveSpellEffects.FindAsync(activeSpellId);
        if (spell == null) return false;

        _context.ActiveSpellEffects.Remove(spell);
        await _context.SaveChangesAsync();
        return true;
    }
}
