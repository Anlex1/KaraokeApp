namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Objeto de transferencia para el inicio de sesión. 
    /// Contiene las credenciales necesarias para autenticar a un usuario y generar un token de acceso.
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// Nombre de usuario único registrado en el sistema.
        /// </summary>
        /// <example>admin_karaoke</example>
        public string Username { get; set; } = null!;

        /// <summary>
        /// Contraseña asociada a la cuenta del usuario.
        /// </summary>
        /// <example>Password123!</example>
        public string Contraseña { get; set; } = null!;
    }
}
