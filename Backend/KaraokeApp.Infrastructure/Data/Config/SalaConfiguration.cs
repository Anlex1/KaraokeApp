using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class SalaConfiguration : IEntityTypeConfiguration<Sala>
{
    public void Configure(EntityTypeBuilder<Sala> builder)
    {
        builder.ToTable("salas");
        builder.HasKey(s => s.IdSala);
        builder.Property(s => s.IdSala).HasColumnName("id_sala").UseIdentityColumn();
        builder.Property(s => s.NumeroSala).HasColumnName("numero_sala").IsRequired().HasMaxLength(10);
        builder.HasIndex(s => s.NumeroSala).IsUnique();
        builder.Property(s => s.Estado).HasColumnName("estado").HasMaxLength(20).HasDefaultValue("Disponible");
        builder.Property(s => s.PrecioHora).HasColumnName("precio_hora").HasColumnType("numeric(10,2)");
        builder.Property(s => s.Capacidad).HasColumnName("capacidad");
    }
}