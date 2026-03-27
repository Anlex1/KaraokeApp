using System;
using System.Collections.Generic;
using System.Text;

namespace KaraokeApp.Core.Entities
{
    public class Reserva
    {
        public int IdReserva { get; set; }
        public int IdSala { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string EstadoReserva { get; set; } = "Activa"; // "Activa", "Cerrada"
        public int CantidadPersonas { get; set; }
        public decimal ValorTotal { get; set; }
        public DateTime? HoraLlegada { get; set; }
        public DateTime? HoraSalida { get; set; }

        // Navegación
        public Sala Sala { get; set; } = null!;
        public Usuario Usuario { get; set; } = null!;
        public ICollection<Pedido> Pedidos { get; set; } = [];
    }
}
