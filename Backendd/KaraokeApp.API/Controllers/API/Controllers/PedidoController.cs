using KaraokeApp.Core.DTOs.Pedido;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

/// <summary>
/// Controlador para la gestión de pedidos de productos en las reservas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidoController : ControllerBase
{
    private readonly IPedidoRepository _pedidoRepo;
    private readonly IProductoRepository _productoRepo;

    /// <summary>
    /// Constructor del controlador de Pedidos.
    /// </summary>
    public PedidoController(IPedidoRepository pedidoRepo, IProductoRepository productoRepo)
    {
        _pedidoRepo = pedidoRepo;
        _productoRepo = productoRepo;
    }

    /// <summary>
    /// Obtiene el listado completo de pedidos realizados.
    /// </summary>
    /// <returns>Una lista de todos los pedidos registrados.</returns>
    /// <response code="200">Retorna la lista de pedidos.</response>
    /// <response code="401">No autorizado. Requiere token válido.</response>
    /// <response code="403">Prohibido. Solo Admin o Empleado pueden acceder.</response>
    [Authorize(Roles = "Admin,Empleado")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _pedidoRepo.GetAllAsync());
    }

    /// <summary>
    /// Obtiene los pedidos que aún no han sido entregados o están pendientes.
    /// </summary>
    /// <response code="200">Retorna los pedidos pendientes.</response>
    [Authorize(Roles = "Admin,Empleado")]
    [HttpGet("pendientes")]
    [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendientes()
    {
        return Ok(await _pedidoRepo.GetPendientesAsync());
    }

    /// <summary>
    /// Obtiene todos los pedidos asociados a una reserva específica.
    /// </summary>
    /// <param name="idReserva">Identificador único de la reserva.</param>
    /// <response code="200">Retorna los pedidos de la reserva.</response>
    [AllowAnonymous]
    [HttpGet("reserva/{idReserva}")]
    [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByReserva(int idReserva)
    {
        return Ok(await _pedidoRepo.GetByReservaAsync(idReserva));
    }

    /// <summary>
    /// Obtiene el detalle de un pedido específico por su ID.
    /// </summary>
    /// <param name="id">ID del pedido.</param>
    /// <response code="200">Retorna el pedido encontrado.</response>
    /// <response code="404">Si el pedido no existe.</response>
    [Authorize(Roles = "Admin,Empleado")]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Pedido), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoRepo.GetByIdAsync(id);
        return pedido is null ? NotFound() : Ok(pedido);
    }

    /// <summary>
    /// Crea un nuevo pedido, valida el stock y descuenta las existencias de los productos.
    /// </summary>
    /// <param name="dto">Información del pedido y lista de productos.</param>
    /// <response code="201">Pedido creado exitosamente.</response>
    /// <response code="400">Si el producto no está activo o no hay stock suficiente.</response>
    /// <response code="404">Si alguno de los productos en el detalle no existe.</response>
    [AllowAnonymous]
    [HttpPost]
    [ProducesResponseType(typeof(Pedido), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Actualiza el estado de un pedido (ej. de Pendiente a Entregado).
    /// </summary>
    /// <param name="id">ID del pedido a modificar.</param>
    /// <param name="dto">Nuevo estado del pedido.</param>
    /// <response code="204">Estado actualizado correctamente.</response>
    /// <response code="400">Si el estado enviado no es válido.</response>
    /// <response code="404">Si el pedido no existe.</response>
    [Authorize(Roles = "Admin,Empleado")]
    [HttpPatch("{id}/estado")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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