using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    id_producto = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    precio = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    estado_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    stock = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productos", x => x.id_producto);
                });

            migrationBuilder.CreateTable(
                name: "salas",
                columns: table => new
                {
                    id_sala = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    numero_sala = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Disponible"),
                    precio_hora = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    capacidad = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_salas", x => x.id_sala);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    rol = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    contrasena = table.Column<string>(type: "text", nullable: false),
                    correo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Activo")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id_usuario);
                });

            migrationBuilder.CreateTable(
                name: "reservas",
                columns: table => new
                {
                    id_reserva = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_sala = table.Column<int>(type: "integer", nullable: false),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    fecha_hora_inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fecha_hora_fin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    estado_reserva = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Activa"),
                    cantidad_personas = table.Column<int>(type: "integer", nullable: false),
                    valor_total = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    hora_llegada = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    hora_salida = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservas", x => x.id_reserva);
                    table.ForeignKey(
                        name: "FK_reservas_salas_id_sala",
                        column: x => x.id_sala,
                        principalTable: "salas",
                        principalColumn: "id_sala",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reservas_usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "pedidos",
                columns: table => new
                {
                    id_pedido = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_reserva = table.Column<int>(type: "integer", nullable: false),
                    estado_pedido = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Pendiente"),
                    fecha_hora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    total = table.Column<decimal>(type: "numeric(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pedidos", x => x.id_pedido);
                    table.ForeignKey(
                        name: "FK_pedidos_reservas_id_reserva",
                        column: x => x.id_reserva,
                        principalTable: "reservas",
                        principalColumn: "id_reserva",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "detalle_pedidos",
                columns: table => new
                {
                    id_detalle_pedido = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_pedido = table.Column<int>(type: "integer", nullable: false),
                    id_producto = table.Column<int>(type: "integer", nullable: false),
                    cantidad = table.Column<int>(type: "integer", nullable: false),
                    subtotal = table.Column<decimal>(type: "numeric(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalle_pedidos", x => x.id_detalle_pedido);
                    table.ForeignKey(
                        name: "FK_detalle_pedidos_pedidos_id_pedido",
                        column: x => x.id_pedido,
                        principalTable: "pedidos",
                        principalColumn: "id_pedido",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_detalle_pedidos_productos_id_producto",
                        column: x => x.id_producto,
                        principalTable: "productos",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_detalle_pedidos_id_pedido",
                table: "detalle_pedidos",
                column: "id_pedido");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_pedidos_id_producto",
                table: "detalle_pedidos",
                column: "id_producto");

            migrationBuilder.CreateIndex(
                name: "IX_pedidos_id_reserva",
                table: "pedidos",
                column: "id_reserva");

            migrationBuilder.CreateIndex(
                name: "IX_reservas_id_sala",
                table: "reservas",
                column: "id_sala");

            migrationBuilder.CreateIndex(
                name: "IX_reservas_id_usuario",
                table: "reservas",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_salas_numero_sala",
                table: "salas",
                column: "numero_sala",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_correo",
                table: "usuarios",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_username",
                table: "usuarios",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "detalle_pedidos");

            migrationBuilder.DropTable(
                name: "pedidos");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "reservas");

            migrationBuilder.DropTable(
                name: "salas");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
