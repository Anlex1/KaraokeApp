using System;
using System.Collections.Generic;
using System.Text;

namespace KaraokeApp.Core.Entities
{
    public class Pedido
    {
        public int IdPedido { get; set; }
        public int IdReserva { get; set; }
        public string EstadoPedido { get; set; } = "Pendiente"; // "Pendiente", "En preparación", "Entregado"
        public DateTime FechaHora { get; set; }
        public decimal Total { get; set; }

        // Navegación
        public Reserva Reserva { get; set; } = null!;
        public ICollection<DetallePedido> Detalles { get; set; } = [];
    }
}
