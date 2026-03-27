namespace KaraokeApp.Core.DTOs.Pedido
{
    public class PedidoResponseDto
    {
        public int IdPedido { get; set; }
        public int IdReserva { get; set; }
        public string EstadoPedido { get; set; } = null!;
        public DateTime FechaHora { get; set; }
        public decimal Total { get; set; }
        public List<DetallePedidoResponseDto> Detalles { get; set; } = [];
    }

    public class DetallePedidoResponseDto
    {
        public int IdDetallePedido { get; set; }
        public string NombreProducto { get; set; } = null!;
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; }
    }
}
