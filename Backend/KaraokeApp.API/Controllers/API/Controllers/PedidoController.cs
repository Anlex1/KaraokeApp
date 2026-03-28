using KaraokeApp.Core.DTOs.Pedido;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidoController : ControllerBase
{
    private readonly IPedidoRepository _pedidoRepo;
    private readonly IProductoRepository _productoRepo;

    public PedidoController(IPedidoRepository pedidoRepo, IProductoRepository productoRepo)
    {
        _pedidoRepo = pedidoRepo;
        _productoRepo = productoRepo;
    }

    [Authorize(Roles = "Admin,Empleado")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _pedidoRepo.GetAllAsync());
    }

    [Authorize(Roles = "Admin,Empleado")]

    [HttpGet("pendientes")]
    public async Task<IActionResult> GetPendientes()
    {
        return Ok(await _pedidoRepo.GetPendientesAsync());
    }

    [AllowAnonymous]
    [HttpGet("reserva/{idReserva}")]
    public async Task<IActionResult> GetByReserva(int idReserva)
    {
        return Ok(await _pedidoRepo.GetByReservaAsync(idReserva));
    }

    [Authorize(Roles = "Admin,Empleado")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoRepo.GetByIdAsync(id);
        return pedido is null ? NotFound() : Ok(pedido);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearPedidoDto dto)
    {
        var detalles = new List<DetallePedido>();
        decimal total = 0;

        foreach (var item in dto.Detalles)
        {
            var producto = await _productoRepo.GetByIdAsync(item.IdProducto);
            if (producto is null) return NotFound($"Producto {item.IdProducto} no encontrado");
            if (!producto.EstadoActivo) return BadRequest($"Producto {producto.Nombre} no está disponible");
            if (producto.Stock < item.Cantidad) return BadRequest($"Stock insuficiente para {producto.Nombre}");

            var subtotal = producto.Precio * item.Cantidad;
            total += subtotal;

            detalles.Add(new DetallePedido
            {
                IdProducto = item.IdProducto,
                Cantidad = item.Cantidad,
                Subtotal = subtotal
            });

            // Descontar stock
            producto.Stock -= item.Cantidad;
            await _productoRepo.UpdateAsync(producto);
        }

        var pedido = new Pedido
        {
            IdReserva = dto.IdReserva,
            EstadoPedido = "Pendiente",
            FechaHora = DateTime.UtcNow,
            Total = total,
            Detalles = detalles
        };

        await _pedidoRepo.AddAsync(pedido);
        return CreatedAtAction(nameof(GetById), new { id = pedido.IdPedido }, pedido);
    }

    [Authorize(Roles = "Admin,Empleado")]
    [HttpPatch("{id}/estado")]
    public async Task<IActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoPedidoDto dto)
    {
        var pedido = await _pedidoRepo.GetByIdAsync(id);
        if (pedido is null) return NotFound();

        var estadosValidos = new[] { "Pendiente", "En preparación", "Entregado" };
        if (!estadosValidos.Contains(dto.EstadoPedido))
            return BadRequest("Estado no válido");

        pedido.EstadoPedido = dto.EstadoPedido;
        await _pedidoRepo.UpdateAsync(pedido);
        return NoContent();
    }
}