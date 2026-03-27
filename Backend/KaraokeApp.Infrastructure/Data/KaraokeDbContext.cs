using KaraokeApp.Core.Entities;
using KaraokeApp.Infrastructure.Data.Configuration;
using Microsoft.EntityFrameworkCore;

namespace KaraokeApp.Infrastructure.Data;

public class KaraokeDbContext : DbContext
{
    public KaraokeDbContext(DbContextOptions<KaraokeDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Sala> Salas => Set<Sala>();
    public DbSet<Reserva> Reservas => Set<Reserva>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<DetallePedido> DetallePedidos => Set<DetallePedido>();
    public DbSet<Producto> Productos => Set<Producto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
        modelBuilder.ApplyConfiguration(new SalaConfiguration());
        modelBuilder.ApplyConfiguration(new ReservaConfiguration());
        modelBuilder.ApplyConfiguration(new PedidoConfiguration());
        modelBuilder.ApplyConfiguration(new DetallePedidoConfiguration());
        modelBuilder.ApplyConfiguration(new ProductoConfiguration());
    }
}