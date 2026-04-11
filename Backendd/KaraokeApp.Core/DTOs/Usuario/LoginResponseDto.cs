namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Estructura de respuesta tras un inicio de sesión exitoso.
    /// Contiene la credencial de acceso y datos básicos del perfil.
    /// </summary>
    public class LoginResponseDto
    {
        /// <summary>
        /// Token de autenticación JWT (JSON Web Token). 
        /// Debe incluirse en la cabecera 'Authorization' como 'Bearer [token]' en peticiones protegidas.
        /// </summary>
        /// <example>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</example>
        public string Token { get; set; } = null!;

        /// <summary>
        /// Nombre completo del usuario autenticado para mostrar en la interfaz.
        /// </summary>
        /// <example>Administrador Principal</example>
        public string Nombre { get; set; } = null!;

        /// <summary>
        /// Rol asignado al usuario que determina sus niveles de acceso en la aplicación.
        /// </summary>
        /// <example>Admin</example>
        public string Rol { get; set; } = null!;
    }
}