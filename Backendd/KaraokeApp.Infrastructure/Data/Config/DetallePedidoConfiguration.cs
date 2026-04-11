using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class DetallePedidoConfiguration : IEntityTypeConfiguration<DetallePedido>
{
    public void Configure(EntityTypeBuilder<DetallePedido> builder)
    {
        builder.ToTable("detalle_pedidos");
        builder.HasKey(d => d.IdDetallePedido);
        builder.Property(d => d.IdDetallePedido).HasColumnName("id_detalle_pedido").UseIdentityColumn();
        builder.Property(d => d.IdPedido).HasColumnName("id_pedido");
        builder.Property(d => d.IdProducto).HasColumnName("id_producto");
        builder.Property(d => d.Cantidad).HasColumnName("cantidad");
        builder.Property(d => d.Subtotal).HasColumnName("subtotal").HasColumnType("numeric(10,2)");

        builder.HasOne(d => d.Pedido)
            .WithMany(p => p.Detalles)
            .HasForeignKey(d => d.IdPedido)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Producto)
            .WithMany(p => p.Detalles)
            .HasForeignKey(d => d.IdProducto)
            .OnDelete(DeleteBehavior.Restrict);
    }
}