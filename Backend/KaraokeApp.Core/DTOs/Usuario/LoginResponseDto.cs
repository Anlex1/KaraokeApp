namespace KaraokeApp.Core.DTOs.Usuario
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Rol { get; set; } = null!;
    }
}
