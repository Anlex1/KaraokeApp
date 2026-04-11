namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Objeto de transferencia para la actualización de información de perfil y estado de un usuario.
    /// </summary>
    /// <remarks>
    /// Los campos son opcionales. Enviar un valor nulo preservará el dato actual en la base de datos.
    /// </remarks>
    public class ActualizarUsuarioDto
    {
        /// <summary>
        /// Nombre completo o alias actualizado del usuario.
        /// </summary>
        /// <example>Carlos Mario Restrepo</example>
        public string? Nombre { get; set; }

        /// <summary>
        /// Dirección de correo electrónico actualizada. Debe tener un formato válido.
        /// </summary>
        /// <example>carlos.m@ejemplo.com</example>
        public string? Correo { get; set; }

        /// <summary>
        /// Estado administrativo del usuario dentro del sistema.
        /// </summary>
        /// <remarks>
        /// Valores sugeridos: "Activo", "Inactivo", "Baneado".
        /// </remarks>
        /// <example>Activo</example>
        public string? Estado { get; set; }
    }
}