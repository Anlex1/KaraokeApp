namespace KaraokeApp.Core.DTOs.Reserva
{
    public class CrearReservaDto
    {
        public int IdSala { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public int CantidadPersonas { get; set; }
    }
}
