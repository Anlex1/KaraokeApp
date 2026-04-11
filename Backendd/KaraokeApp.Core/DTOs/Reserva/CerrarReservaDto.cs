namespace KaraokeApp.Core.DTOs.Reserva
{
    /// <summary>
    /// Objeto de transferencia de datos para la finalización y cierre de una reserva.
    /// </summary>
    public class CerrarReservaDto
    {
        /// <summary>
        /// Fecha y hora exacta en la que el cliente desocupa la sala.
        /// </summary>
        /// <remarks>
        /// Este valor se utiliza para calcular el tiempo total de uso y generar el cobro final basado en la tarifa de la sala.
        /// </remarks>
        /// <example>2026-02-08 23:30</example>
        public DateTime HoraSalida { get; set; }
    }
}
