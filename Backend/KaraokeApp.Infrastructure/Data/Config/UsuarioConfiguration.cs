using KaraokeApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KaraokeApp.Infrastructure.Data.Configuration;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");
        builder.HasKey(u => u.IdUsuario);
        builder.Property(u => u.IdUsuario).HasColumnName("id_usuario").UseIdentityColumn();
        builder.Property(u => u.Nombre).HasColumnName("nombre").IsRequired().HasMaxLength(100);
        builder.Property(u => u.Rol).HasColumnName("rol").IsRequired().HasMaxLength(20);
        builder.Property(u => u.Username).HasColumnName("username").IsRequired().HasMaxLength(50);
        builder.HasIndex(u => u.Username).IsUnique();
        builder.Property(u => u.Contraseña).HasColumnName("contrasena").IsRequired();
        builder.Property(u => u.Correo).HasColumnName("correo").IsRequired().HasMaxLength(100);
        builder.HasIndex(u => u.Correo).IsUnique();
        builder.Property(u => u.Estado).HasColumnName("estado").HasMaxLength(20).HasDefaultValue("Activo");
    }
}