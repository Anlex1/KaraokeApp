namespace KaraokeApp.Core.DTOs.Pedido
{
    public class CrearPedidoDto
    {
        public int IdReserva { get; set; }
        public List<CrearDetallePedidoDto> Detalles { get; set; } = [];
    }

    public class CrearDetallePedidoDto
    {
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
    }
}
