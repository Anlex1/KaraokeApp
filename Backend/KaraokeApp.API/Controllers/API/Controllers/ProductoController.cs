using KaraokeApp.Core.DTOs.Producto;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoRepository _repo;

        public ProductoController(IProductoRepository repo)
        {
            _repo = repo;
        }

        [AllowAnonymous]
        [HttpGet("activos")]
        public async Task<IActionResult> GetActivos() =>
            Ok(await _repo.GetActivosAsync());

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repo.GetAllAsync());

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var producto = await _repo.GetByIdAsync(id);
            return producto is null ? NotFound() : Ok(producto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
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

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/desactivar")]
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
