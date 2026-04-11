using KaraokeApp.Core.Entities;

namespace KaraokeApp.Core.Interfaces;

public interface IProductoRepository : IGenericRepository<Producto>
{
    Task<IEnumerable<Producto>> GetActivosAsync();
}