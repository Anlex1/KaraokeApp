namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Estructura de respuesta que representa la información pública y administrativa de un usuario.
    /// </summary>
    public class UsuarioResponseDto
    {
        /// <summary>Identificador único del usuario.</summary>
        /// <example>1</example>
        public int IdUsuario { get; set; }

        /// <summary>Nombre completo registrado.</summary>
        /// <example>Andrea Castrillón</example>
        public string Nombre { get; set; } = null!;

        /// <summary>Nivel de acceso (Admin, Empleado, Cliente).</summary>
        /// <example>Cliente</example>
        public string Rol { get; set; } = null!;

        /// <summary>Nombre de cuenta utilizado para el acceso al sistema.</summary>
        /// <example>acastrillon_karaoke</example>
        public string Username { get; set; } = null!;

        /// <summary>Correo electrónico de contacto.</summary>
        /// <example>andrea@ejemplo.com</example>
        public string Correo { get; set; } = null!;

        /// <summary>Estado de la cuenta (Activo, Inactivo, Baneado).</summary>
        /// <example>Activo</example>
        public string Estado { get; set; } = null!;
    }
}
