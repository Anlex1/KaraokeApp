using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class PedidoConfiguration : IEntityTypeConfiguration<Pedido>
{
    public void Configure(EntityTypeBuilder<Pedido> builder)
    {
        builder.ToTable("pedidos");
        builder.HasKey(p => p.IdPedido);
        builder.Property(p => p.IdPedido).HasColumnName("id_pedido").UseIdentityColumn();
        builder.Property(p => p.IdReserva).HasColumnName("id_reserva");
        builder.Property(p => p.EstadoPedido).HasColumnName("estado_pedido").HasMaxLength(20).HasDefaultValue("Pendiente");
        builder.Property(p => p.FechaHora).HasColumnName("fecha_hora");
        builder.Property(p => p.Total).HasColumnName("total").HasColumnType("numeric(10,2)");

        builder.HasOne(p => p.Reserva)
            .WithMany(r => r.Pedidos)
            .HasForeignKey(p => p.IdReserva)
            .OnDelete(DeleteBehavior.Cascade);
    }
}