namespace KaraokeApp.Core.DTOs.Sala
{
    public class SalaResponseDto
    {
        public int IdSala { get; set; }
        public string NumeroSala { get; set; } = null!;
        public string Estado { get; set; } = null!;
        public decimal PrecioHora { get; set; }
        public int Capacidad { get; set; }
    }
}
