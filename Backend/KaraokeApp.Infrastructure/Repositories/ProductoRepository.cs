using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Repositories;

public class ProductoRepository : GenericRepository<Producto>, IProductoRepository
{
    public ProductoRepository(KaraokeDbContext context) : base(context) { }

    public async Task<IEnumerable<Producto>> GetActivosAsync()
    {
        return await _context.Productos.Where(p => p.EstadoActivo).ToListAsync();
    }
}