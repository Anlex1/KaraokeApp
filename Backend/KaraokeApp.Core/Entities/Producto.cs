using System;
using System.Collections.Generic;
using System.Text;

namespace KaraokeApp.Core.Entities
{
    public class Producto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = null!;
        public decimal Precio { get; set; }
        public bool EstadoActivo { get; set; } = true;
        public int Stock { get; set; }

        // Navegación
        public ICollection<DetallePedido> Detalles { get; set; } = [];
    }
}
