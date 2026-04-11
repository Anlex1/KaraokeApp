using KaraokeApp.Core.Entities;

namespace KaraokeApp.Core.Interfaces
{
    public interface IUsuarioRepository : IGenericRepository<Usuario>
    {
        Task<Usuario?> GetByUsernameAsync(string username);
        Task<IEnumerable<Usuario>> GetByRoleAsync(string role);
    }
}
