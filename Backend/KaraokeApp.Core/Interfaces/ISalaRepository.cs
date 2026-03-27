using KaraokeApp.Core.Entities;

namespace KaraokeApp.Core.Interfaces
{
    public interface ISalaRepository: IGenericRepository<Sala>
    {
        Task<IEnumerable<Sala>> GetDisponibles();
    }
}
