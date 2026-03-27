namespace KaraokeApp.Core.DTOs.Producto
{
    public class ActualizarProductoDto
    {
        public string? Nombre { get; set; }
        public decimal? Precio { get; set; }
        public int? Stock { get; set; }
        public bool? EstadoActivo { get; set; }
    }
}
