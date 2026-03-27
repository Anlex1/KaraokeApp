using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> builder)
    {
        builder.ToTable("productos");
        builder.HasKey(p => p.IdProducto);
        builder.Property(p => p.IdProducto).HasColumnName("id_producto").UseIdentityColumn();
        builder.Property(p => p.Nombre).HasColumnName("nombre").IsRequired().HasMaxLength(100);
        builder.Property(p => p.Precio).HasColumnName("precio").HasColumnType("numeric(10,2)");
        builder.Property(p => p.EstadoActivo).HasColumnName("estado_activo").HasDefaultValue(true);
        builder.Property(p => p.Stock).HasColumnName("stock");
    }
}