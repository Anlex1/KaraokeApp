namespace KaraokeApp.Core.DTOs.Sala
{
    public class CrearSalaDto
    {
        public string NumeroSala { get; set; } = null!;
        public decimal PrecioHora { get; set; }
        public int Capacidad { get; set; }
    }
}
