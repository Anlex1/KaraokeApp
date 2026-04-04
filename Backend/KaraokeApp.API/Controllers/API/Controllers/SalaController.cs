using KaraokeApp.Core.DTOs.Sala;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalaController : ControllerBase
{
    private readonly ISalaRepository _repo;
    private readonly QrService _qrService;

    public SalaController(ISalaRepository repo, QrService qrService)
    {
        _repo = repo;
        _qrService = qrService;
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

    [AllowAnonymous]
    [HttpGet("{id}/qr")]
    public async Task<IActionResult> GetQr(int id)
    {
        var sala = await _repo.GetByIdAsync(id);
        if (sala is null) return NotFound();
        if (sala.Estado == "Inactiva") return BadRequest("La sala no está activa");

        var qrBase64 = _qrService.GenerarQrBase64(id);
        return Ok(new
        {
            idSala = id,
            numeroSala = sala.NumeroSala,
            qrBase64,
            qrDataUrl = $"data:image/png;base64,{qrBase64}"
        });
    }
}