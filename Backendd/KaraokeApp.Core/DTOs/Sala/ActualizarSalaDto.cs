namespace KaraokeApp.Core.DTOs.Sala
{
    /// <summary>
    /// Objeto de transferencia para la actualización parcial de los parámetros de una sala.
    /// </summary>
    /// <remarks>
    /// Los campos son opcionales. Si se envían como nulos, se mantendrá el valor actual registrado en la base de datos.
    /// </remarks>
    public class ActualizarSalaDto
    {
        /// <summary>
        /// Tarifa actualizada por cada hora de uso de la sala.
        /// </summary>
        /// <example>25.50</example>
        public decimal? PrecioHora { get; set; }

        /// <summary>
        /// Capacidad máxima de personas permitidas en la sala.
        /// </summary>
        /// <example>10</example>
        public int? Capacidad { get; set; }

        /// <summary>
        /// Estado operativo de la sala (Disponible, Ocupada, Inactiva).
        /// </summary>
        /// <example>Disponible</example>
        public string? Estado { get; set; }
    }
}
