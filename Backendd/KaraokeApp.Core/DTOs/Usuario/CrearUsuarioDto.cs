namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Estructura de datos requerida para el registro inicial de un nuevo usuario en el sistema.
    /// </summary>
    public class CrearUsuarioDto
    {
        /// <summary>
        /// Nombre completo de la persona.
        /// </summary>
        /// <example>Alejandro Martínez</example>
        public string Nombre { get; set; } = null!;

        /// <summary>
        /// Perfil de acceso asignado al usuario.
        /// </summary>
        /// <remarks>Valores permitidos: "Admin", "Empleado", "Cliente".</remarks>
        /// <example>Empleado</example>
        public string Rol { get; set; } = null!;

        /// <summary>
        /// Nombre de usuario único para el inicio de sesión.
        /// </summary>
        /// <example>amartinez_karaoke</example>
        public string Username { get; set; } = null!;

        /// <summary>
        /// Clave de acceso secreta. 
        /// </summary>
        /// <remarks>Esta contraseña será encriptada mediante BCrypt antes de almacenarse en la base de datos.</remarks>
        /// <example>ClaveSegura123!</example>
        public string Contraseña { get; set; } = null!;

        /// <summary>
        /// Dirección de correo electrónico de contacto.
        /// </summary>
        /// <example>alejandro.m@empresa.com</example>
        public string Correo { get; set; } = null!;
    }
}
