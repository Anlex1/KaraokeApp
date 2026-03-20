using System;
using System.Collections.Generic;
using System.Text;

namespace KaraokeApp.Core.Entities
{
    public class Sala
    {
        public int IdSala { get; set; }
        public string NumeroSala { get; set; } = null!;
        public string Estado { get; set; } = "Disponible"; // "Disponible", "Ocupada", "Inactiva"
        public decimal PrecioHora { get; set; }
        public int Capacidad { get; set; }

        // Navegación
        public ICollection<Reserva> Reservas { get; set; } = [];
    }
}
