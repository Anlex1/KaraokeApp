namespace KaraokeApp.Core.DTOs.Usuario
{
    public class UsuarioResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Estado { get; set; } = null!;
    }
}
