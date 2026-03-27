using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Repositories;

public class ReservaRepository : GenericRepository<Reserva>, IReservaRepository
{
    public ReservaRepository(KaraokeDbContext context) : base(context) { }

    public async Task<IEnumerable<Reserva>> GetActivasAsync()
    {
        return await _context.Reservas
            .Include(r => r.Sala)
            .Include(r => r.Usuario)
            .Where(r => r.EstadoReserva == "Activa")
            .ToListAsync();
    }

    public async Task<Reserva?> GetBySalaActivaAsync(int idSala)
    {
        return await _context.Reservas
            .Include(r => r.Sala)
            .Include(r => r.Usuario)
            .FirstOrDefaultAsync(r => r.IdSala == idSala && r.EstadoReserva == "Activa");
    }

    public async Task<IEnumerable<Reserva>> GetByUsuarioAsync(int idUsuario)
    {
        return await _context.Reservas
            .Include(r => r.Sala)
            .Where(r => r.IdUsuario == idUsuario)
            .ToListAsync();
    }
}