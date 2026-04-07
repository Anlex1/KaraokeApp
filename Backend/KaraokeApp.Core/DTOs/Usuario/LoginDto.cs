namespace KaraokeApp.Core.DTOs.Usuario
{
    /// <summary>
    /// Transfer Object para el login de un usuario. Contiene las propiedades necesarias para autenticar a un usuario en el sistema.
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// 
        /// </summary>
        public string Username { get; set; } = null!;
        public string Contraseña { get; set; } = null!;
    }
}
