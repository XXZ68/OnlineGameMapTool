using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GameMapBackend.Features.GameSession;

namespace GameMapBackend.Features.Map
{
    [Table("SessionMaps")]
    public class SessionMapEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid GameSessionId { get; set; }

        [ForeignKey(nameof(GameSessionId))]
        public GameSessionEntity? GameSession { get; set; }

        public Guid? OriginalMapId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public string GridJson { get; set; } = "{}";
        public string TokensJson { get; set; } = "[]";
    }
}