namespace KaraokeApp.Core.DTOs.Reserva
{
    /// <summary>
    /// Estructura de respuesta detallada que representa una reserva completada con información descriptiva.
    /// </summary>
    public class ReservaResponseDto
    {
        /// <summary>Identificador único de la reserva.</summary>
        /// <example>15</example>
        public int IdReserva { get; set; }

        /// <summary>Nombre o número identificador de la sala reservada.</summary>
        /// <example>Sala VIP 01</example>
        public string NumeroSala { get; set; } = null!;

        /// <summary>Nombre completo del usuario que realizó la reserva.</summary>
        /// <example>Juan Pérez</example>
        public string NombreUsuario { get; set; } = null!;

        /// <summary>Fecha y hora programada de inicio.</summary>
        public DateTime FechaHoraInicio { get; set; }

        /// <summary>Fecha y hora programada de finalización.</summary>
        public DateTime FechaHoraFin { get; set; }

        /// <summary>Estado de la reserva (Activa, Cerrada, Cancelada).</summary>
        /// <example>Activa</example>
        public string EstadoReserva { get; set; } = null!;

        /// <summary>Cantidad de asistentes registrados para la sesión.</summary>
        /// <example>6</example>
        public int CantidadPersonas { get; set; }

        /// <summary>Monto total calculado por el tiempo de uso de la sala.</summary>
        /// <example>120.50</example>
        public decimal ValorTotal { get; set; }

        /// <summary>Fecha y hora real en la que el cliente inició la sesión.</summary>
        public DateTime? HoraLlegada { get; set; }

        /// <summary>Fecha y hora real en la que el cliente finalizó la sesión.</summary>
        public DateTime? HoraSalida { get; set; }
    }
}