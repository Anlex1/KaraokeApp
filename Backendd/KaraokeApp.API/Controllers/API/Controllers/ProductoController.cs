using KaraokeApp.Core.DTOs.Producto;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers.API.Controllers
{
    /// <summary>
    /// Controlador para la gestión del catálogo de productos y suministros del Karaoke.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoRepository _repo;

        /// <summary>
        /// Constructor del controlador de Productos.
        /// </summary>
        /// <param name="repo">Repositorio para el acceso a datos de productos.</param>
        public ProductoController(IProductoRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Obtiene la lista de productos que están marcados como activos para la venta.
        /// </summary>
        /// <remarks>Este endpoint es de acceso público.</remarks>
        /// <returns>Lista de productos activos.</returns>
        /// <response code="200">Retorna la lista de productos disponibles.</response>
        [AllowAnonymous]
        [HttpGet("activos")]
        [ProducesResponseType(typeof(IEnumerable<Producto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetActivos() =>
            Ok(await _repo.GetActivosAsync());

        /// <summary>
        /// Obtiene el catálogo completo de productos (activos e inactivos).
        /// </summary>
        /// <returns>Lista total de productos.</returns>
        /// <response code="200">Retorna todos los productos.</response>
        /// <response code="403">Acceso denegado. Se requiere rol de Admin.</response>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Producto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repo.GetAllAsync());

        /// <summary>
        /// Obtiene la información detallada de un producto por su ID.
        /// </summary>
        /// <param name="id">Identificador único del producto.</param>
        /// <response code="200">Retorna el producto solicitado.</response>
        /// <response code="404">Si el producto no existe.</response>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Producto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var producto = await _repo.GetByIdAsync(id);
            return producto is null ? NotFound() : Ok(producto);
        }

        /// <summary>
        /// Registra un nuevo producto en el catálogo.
        /// </summary>
        /// <param name="dto">Datos del nuevo producto.</param>
        /// <response code="201">Producto creado exitosamente.</response>
        /// <response code="400">Si los datos enviados son inválidos.</response>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ProducesResponseType(typeof(Producto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Crear([FromBody] CrearProductoDto dto)
        {
            var producto = new Producto
            {
                Nombre = dto.Nombre,
                Precio = dto.Precio,
                Stock = dto.Stock,
                EstadoActivo = true
            };
            await _repo.AddAsync(producto);
            return CreatedAtAction(nameof(GetById), new { id = producto.IdProducto }, producto);
        }

        /// <summary>
        /// Actualiza la información de un producto existente de forma total o parcial.
        /// </summary>
        /// <param name="id">ID del producto a actualizar.</param>
        /// <param name="dto">Nuevos datos del producto.</param>
        /// <response code="204">Actualización exitosa (sin contenido).</response>
        /// <response code="404">Si el producto a actualizar no existe.</response>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarProductoDto dto)
        {
            var producto = await _repo.GetByIdAsync(id);
            if (producto is null) return NotFound();

            if (dto.Nombre is not null) producto.Nombre = dto.Nombre;
            if (dto.Precio.HasValue) producto.Precio = dto.Precio.Value;
            if (dto.Stock.HasValue) producto.Stock = dto.Stock.Value;
            if (dto.EstadoActivo.HasValue) producto.EstadoActivo = dto.EstadoActivo.Value;

            await _repo.UpdateAsync(producto);
            return NoContent();
        }

        /// <summary>
        /// Desactiva lógicamente un producto del catálogo para que no esté disponible al público.
        /// </summary>
        /// <param name="id">ID del producto a desactivar.</param>
        /// <response code="204">Desactivación exitosa.</response>
        /// <response code="404">Si el producto no existe.</response>
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/desactivar")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Desactivar(int id)
        {
            var producto = await _repo.GetByIdAsync(id);
            if (producto is null) return NotFound();

            producto.EstadoActivo = false;
            await _repo.UpdateAsync(producto);
            return NoContent();
        }
    }
}
