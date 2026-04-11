using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Repositories;

public class SalaRepository : GenericRepository<Sala>, ISalaRepository
{
    public SalaRepository(KaraokeDbContext context) : base(context) { }

    public async Task<IEnumerable<Sala>> GetDisponibles()
    {
        return await _context.Salas.Where(s => s.Estado == "Disponible").ToListAsync();
    }    
}