using KaraokeApp.Core.Entities;

namespace KaraokeApp.Core.Interfaces;

public interface IPedidoRepository : IGenericRepository<Pedido>
{
    Task<IEnumerable<Pedido>> GetByReservaAsync(int idReserva);
    Task<IEnumerable<Pedido>> GetPendientesAsync();
}