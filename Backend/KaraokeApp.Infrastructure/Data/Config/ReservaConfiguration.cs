using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class ReservaConfiguration : IEntityTypeConfiguration<Reserva>
{
    public void Configure(EntityTypeBuilder<Reserva> builder)
    {
        builder.ToTable("reservas");
        builder.HasKey(r => r.IdReserva);
        builder.Property(r => r.IdReserva).HasColumnName("id_reserva").UseIdentityColumn();
        builder.Property(r => r.IdSala).HasColumnName("id_sala");
        builder.Property(r => r.IdUsuario).HasColumnName("id_usuario");
        builder.Property(r => r.FechaHoraInicio).HasColumnName("fecha_hora_inicio");
        builder.Property(r => r.FechaHoraFin).HasColumnName("fecha_hora_fin");
        builder.Property(r => r.EstadoReserva).HasColumnName("estado_reserva").HasMaxLength(20).HasDefaultValue("Activa");
        builder.Property(r => r.CantidadPersonas).HasColumnName("cantidad_personas");
        builder.Property(r => r.ValorTotal).HasColumnName("valor_total").HasColumnType("numeric(10,2)");
        builder.Property(r => r.HoraLlegada).HasColumnName("hora_llegada");
        builder.Property(r => r.HoraSalida).HasColumnName("hora_salida");

        builder.HasOne(r => r.Sala)
            .WithMany(s => s.Reservas)
            .HasForeignKey(r => r.IdSala)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Usuario)
            .WithMany(u => u.Reservas)
            .HasForeignKey(r => r.IdUsuario)
            .OnDelete(DeleteBehavior.Restrict);
    }
}