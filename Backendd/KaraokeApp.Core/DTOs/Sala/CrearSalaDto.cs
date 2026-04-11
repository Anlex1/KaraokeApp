namespace KaraokeApp.Core.DTOs.Sala
{
    /// <summary>
    /// Datos requeridos para el registro y creación de una nueva sala en el sistema.
    /// </summary>
    public class CrearSalaDto
    {
        /// <summary>
        /// Nombre o número identificador de la sala (ej: "Sala 01", "VIP Platinum").
        /// </summary>
        /// <example>Sala 05</example>
        public string NumeroSala { get; set; } = null!;

        /// <summary>
        /// Tarifa establecida por hora para el uso de esta sala.
        /// </summary>
        /// <example>30.00</example>
        public decimal PrecioHora { get; set; }

        /// <summary>
        /// Cantidad máxima de personas que pueden ocupar la sala cómodamente.
        /// </summary>
        /// <example>8</example>
        public int Capacidad { get; set; }
    }
}
