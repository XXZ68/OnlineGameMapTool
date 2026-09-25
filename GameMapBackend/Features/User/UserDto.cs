using System;

namespace GameMapBackend.Features.User
{
    public record AuthRequestDto(string Username, string Password);
    public record AuthResponseDto(Guid UserId, string Username);
}