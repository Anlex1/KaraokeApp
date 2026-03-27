using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Repositories;

public class PedidoRepository : GenericRepository<Pedido>, IPedidoRepository
{
    public PedidoRepository(KaraokeDbContext context) : base(context) { }

    public async Task<IEnumerable<Pedido>> GetByReservaAsync(int idReserva)
    {
        return await _context.Pedidos
            .Include(p => p.Detalles)
            .ThenInclude(d => d.Producto)
            .Where(p => p.IdReserva == idReserva)
            .ToListAsync();      
    }

    public async Task<IEnumerable<Pedido>> GetPendientesAsync()
    {
        return await _context.Pedidos
            .Include(p => p.Detalles)
            .ThenInclude(d => d.Producto)
            .Include(p => p.Reserva)
            .ThenInclude(r => r.Sala)
            .Where(p => p.EstadoPedido == "Pendiente" || p.EstadoPedido == "En preparación")
            .ToListAsync();
    }
}