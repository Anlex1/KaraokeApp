using KaraokeApp.Core.DTOs.Sala;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalaController : ControllerBase
{
    private readonly ISalaRepository _repo;

    public SalaController(ISalaRepository repo)
    {
        _repo = repo;
    }

    [AllowAnonymous]
    [HttpGet("disponibles")]
    public async Task<IActionResult> GetDisponibles()
    {
        return Ok(await _repo.GetDisponibles());
    }

    [Authorize(Roles = "Admin, Empleado")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _repo.GetAllAsync());
    }

    [Authorize(Roles = "Admin, Empleado")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var sala = await _repo.GetByIdAsync(id);
        return sala is null ? NotFound() : Ok(sala);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearSalaDto dto)
    {
        var sala = new Sala
        {
            NumeroSala = dto.NumeroSala,
            PrecioHora = dto.PrecioHora,
            Capacidad = dto.Capacidad,
            Estado = "Disponible"
        };
        await _repo.AddAsync(sala);
        return CreatedAtAction(nameof(GetById), new { id = sala.IdSala }, sala);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarSalaDto dto)
    {
        var sala = await _repo.GetByIdAsync(id);
        if (sala is null) return NotFound();

        if (dto.PrecioHora.HasValue) sala.PrecioHora = dto.PrecioHora.Value;
        if (dto.Capacidad.HasValue) sala.Capacidad = dto.Capacidad.Value;
        if (dto.Estado is not null) sala.Estado = dto.Estado;

        await _repo.UpdateAsync(sala);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/desactivar")]
    public async Task<IActionResult> Desactivar(int id)
    {
        var sala = await _repo.GetByIdAsync(id);
        if (sala is null) return NotFound();

        sala.Estado = "Inactiva";
        await _repo.UpdateAsync(sala);
        return NoContent();
    }
}