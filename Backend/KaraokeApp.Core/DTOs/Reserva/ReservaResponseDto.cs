namespace KaraokeApp.Core.DTOs.Reserva
{
    public class ReservaResponseDto
    {
        public int IdReserva { get; set; }
        public string NumeroSala { get; set; } = null!;
        public string NombreUsuario { get; set; } = null!;
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string EstadoReserva { get; set; } = null!;
        public int CantidadPersonas { get; set; }
        public decimal ValorTotal { get; set; }
        public DateTime? HoraLlegada { get; set; }
        public DateTime? HoraSalida { get; set; }
    }
}