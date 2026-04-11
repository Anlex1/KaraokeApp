using KaraokeApp.Core.DTOs.Sala;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

/// <summary>
/// Controlador para la gestión física y administrativa de las salas de karaoke.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalaController : ControllerBase
{
    private readonly ISalaRepository _repo;
    private readonly QrService _qrService;

    /// <summary>
    /// Constructor del controlador de Sala.
    /// </summary>
    public SalaController(ISalaRepository repo, QrService qrService)
    {
        _repo = repo;
        _qrService = qrService;
    }

    /// <summary>
    /// Obtiene todas las salas que tienen estado 'Disponible'.
    /// </summary>
    /// <remarks>Accesible para todos los usuarios (clientes y personal).</remarks>
    /// <response code="200">Retorna el listado de salas libres.</response>
    [AllowAnonymous]
    [HttpGet("disponibles")]
    [ProducesResponseType(typeof(IEnumerable<Sala>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDisponibles()
    {
        return Ok(await _repo.GetDisponibles());
    }

    /// <summary>
    /// Obtiene el listado completo de todas las salas registradas.
    /// </summary>
    /// <response code="200">Retorna todas las salas.</response>
    /// <response code="403">Acceso denegado. Requiere rol de Admin o Empleado.</response>
    [Authorize(Roles = "Admin, Empleado")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Sala>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _repo.GetAllAsync());
    }

    /// <summary>
    /// Obtiene la información detallada de una sala específica por su ID.
    /// </summary>
    /// <param name="id">ID único de la sala.</param>
    /// <response code="200">Retorna la sala encontrada.</response>
    /// <response code="404">Si la sala no existe.</response>
    [Authorize(Roles = "Admin, Empleado")]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Sala), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var sala = await _repo.GetByIdAsync(id);
        return sala is null ? NotFound() : Ok(sala);
    }

    /// <summary>
    /// Registra una nueva sala en el sistema.
    /// </summary>
    /// <param name="dto">Datos de configuración de la nueva sala.</param>
    /// <response code="201">Sala creada con éxito.</response>
    /// <response code="403">Acceso denegado. Solo administradores pueden crear salas.</response>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(Sala), StatusCodes.Status201Created)]
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

    /// <summary>
    /// Actualiza los parámetros de una sala (precio, capacidad o estado).
    /// </summary>
    /// <param name="id">ID de la sala a modificar.</param>
    /// <param name="dto">Nuevos valores para la sala.</param>
    /// <response code="204">Actualización realizada correctamente.</response>
    /// <response code="404">Si la sala no existe.</response>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Cambia el estado de una sala a 'Inactiva', impidiendo su uso para nuevas reservas.
    /// </summary>
    /// <param name="id">ID de la sala a desactivar.</param>
    /// <response code="204">Sala desactivada exitosamente.</response>
    /// <response code="404">Si la sala no existe.</response>
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/desactivar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Desactivar(int id)
    {
        var sala = await _repo.GetByIdAsync(id);
        if (sala is null) return NotFound();

        sala.Estado = "Inactiva";
        await _repo.UpdateAsync(sala);
        return NoContent();
    }

    /// <summary>
    /// Genera y retorna un código QR en formato Base64 para una sala específica.
    /// </summary>
    /// <remarks>Permite a las aplicaciones móviles obtener el código para ser impreso o mostrado digitalmente.</remarks>
    /// <param name="id">ID de la sala.</param>
    /// <response code="200">Retorna el código QR generado.</response>
    /// <response code="400">Si la sala está inactiva y no puede generar QR.</response>
    /// <response code="404">Si la sala no existe.</response>
    [AllowAnonymous]
    [HttpGet("{id}/qr")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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