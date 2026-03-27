using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Repositories;

public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
{
    public UsuarioRepository(KaraokeDbContext context) : base(context) { }

    public async Task<Usuario?> GetByUsernameAsync(string username)
    {
       return await _context.Usuarios.FirstOrDefaultAsync(u => u.Username == username);
    }          

    public async Task<IEnumerable<Usuario>> GetByRoleAsync(string rol)
    {
        return await _context.Usuarios.Where(u => u.Rol == rol).ToListAsync();
    }
}