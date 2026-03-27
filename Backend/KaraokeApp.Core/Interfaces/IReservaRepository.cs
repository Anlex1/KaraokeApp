using KaraokeApp.Core.Entities;

namespace KaraokeApp.Core.Interfaces;

public interface IReservaRepository : IGenericRepository<Reserva>
{
    Task<IEnumerable<Reserva>> GetActivasAsync();
    Task<Reserva?> GetBySalaActivaAsync(int idSala);
    Task<IEnumerable<Reserva>> GetByUsuarioAsync(int idUsuario);
}