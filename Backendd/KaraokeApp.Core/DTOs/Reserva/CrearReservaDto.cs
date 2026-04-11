namespace KaraokeApp.Core.DTOs.Reserva
{
    /// <summary>
    /// Estructura de datos necesaria para registrar la apertura de una nueva reserva de sala.
    /// </summary>
    public class CrearReservaDto
    {
        /// <summary>
        /// Identificador de la sala que se desea reservar.
        /// </summary>
        /// <example>1</example>
        public int IdSala { get; set; }

        /// <summary>
        /// Identificador del usuario (cliente o responsable) que realiza la reserva.
        /// </summary>
        /// <example>5</example>
        public int IdUsuario { get; set; }

        /// <summary>
        /// Fecha y hora programada para el inicio de la sesión de Karaoke.
        /// </summary>
        /// <example>2026-03-08 20:00</example>
        public DateTime FechaHoraInicio { get; set; }

        /// <summary>
        /// Fecha y hora estimada en la que finalizará la sesión.
        /// </summary>
        /// <example>2026-04-08T22:00:00Z</example>
        public DateTime FechaHoraFin { get; set; }

        /// <summary>
        /// Número de personas que asistirán. Ayuda a validar si la capacidad de la sala es adecuada.
        /// </summary>
        /// <example>4</example>
        public int CantidadPersonas { get; set; }
    }
}