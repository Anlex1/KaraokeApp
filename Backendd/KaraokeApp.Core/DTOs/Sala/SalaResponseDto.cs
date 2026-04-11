namespace KaraokeApp.Core.DTOs.Sala
{
    /// <summary>
    /// Objeto de respuesta que contiene la información detallada de una sala de karaoke.
    /// </summary>
    public class SalaResponseDto
    {
        /// <summary>
        /// Identificador único de la sala en el sistema.
        /// </summary>
        /// <example>1</example>
        public int IdSala { get; set; }

        /// <summary>
        /// Nombre o número identificador visible de la sala.
        /// </summary>
        /// <example>Sala VIP 01</example>
        public string NumeroSala { get; set; } = null!;

        /// <summary>
        /// Estado actual de la sala.
        /// </summary>
        /// <remarks>
        /// Valores comunes: "Disponible", "Ocupada", "Inactiva", "Mantenimiento".
        /// </remarks>
        /// <example>Disponible</example>
        public string Estado { get; set; } = null!;

        /// <summary>
        /// Costo configurado por cada hora de uso.
        /// </summary>
        /// <example>45.00</example>
        public decimal PrecioHora { get; set; }

        /// <summary>
        /// Número máximo de personas permitidas en este espacio.
        /// </summary>
        /// <example>12</example>
        public int Capacidad { get; set; }
    }
}
