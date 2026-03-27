namespace KaraokeApp.Core.DTOs.Usuario
{
    public class CrearUsuarioDto
    {
        public string Nombre { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Contraseña { get; set; } = null!;
        public string Correo { get; set; } = null!;
    }
}
