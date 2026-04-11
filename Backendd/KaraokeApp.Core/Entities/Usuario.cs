using System;
using System.Collections.Generic;
using System.Text;

namespace KaraokeApp.Core.Entities
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Rol { get; set; } = null!; // "Admin", "Empleado", "Cliente"
        public string Username { get; set; } = null!;
        public string Contraseña { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Estado { get; set; } = "Activo"; // "Activo", "Inactivo", "Baneado"

        // Navegación
        public ICollection<Reserva> Reservas { get; set; } = [];
    }
}
