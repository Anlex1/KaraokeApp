using KaraokeApp.Core.DTOs.Reserva;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

/// <summary>
/// Controlador para la gestión de reservas de salas, control de tiempos y facturación.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin, Empleado")]
public class ReservaController : ControllerBase
{
    private readonly IReservaRepository _reservaRepo;
    private readonly ISalaRepository _salaRepo;
    private readonly QrService _qrService;

    /// <summary>
    /// Constructor del controlador de Reservas.
    /// </summary>
    public ReservaController(IReservaRepository reservaRepo, ISalaRepository salaRepo, QrService qrService)
    {
        _reservaRepo = reservaRepo;
        _salaRepo = salaRepo;
        _qrService = qrService;
    }

    /// <summary>
    /// Obtiene el historial completo de todas las reservas registradas.
    /// </summary>
    /// <returns>Lista de todas las reservas.</returns>
    /// <response code="200">Retorna la lista de reservas.</response>
    /// <response code="403">Acceso denegado. Se requiere rol de Admin o Empleado.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Reserva>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _reservaRepo.GetAllAsync());
    }

    /// <summary>
    /// Obtiene únicamente las reservas que se encuentran en estado 'Activa'.
    /// </summary>
    /// <returns>Lista de reservas activas.</returns>
    /// <response code="200">Retorna las reservas activas en curso.</response>
    [HttpGet("activas")]
    [ProducesResponseType(typeof(IEnumerable<Reserva>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivas()
    {
        return Ok(await _reservaRepo.GetActivasAsync());
    }

    /// <summary>
    /// Obtiene los detalles de una reserva específica por su ID.
    /// </summary>
    /// <param name="id">ID de la reserva.</param>
    /// <response code="200">Retorna la reserva encontrada.</response>
    /// <response code="404">Si la reserva no existe.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Reserva), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var reserva = await _reservaRepo.GetByIdAsync(id);
        return reserva is null ? NotFound() : Ok(reserva);
    }

    /// <summary>
    /// Busca la reserva activa asociada a una sala específica.
    /// </summary>
    /// <remarks>Este endpoint es útil para que los clientes identifiquen su sesión actual mediante el escaneo de la sala.</remarks>
    /// <param name="idSala">ID de la sala a consultar.</param>
    /// <response code="200">Retorna la reserva activa de la sala.</response>
    /// <response code="404">Si no hay una reserva activa para esa sala.</response>
    [AllowAnonymous]
    [HttpGet("sala/{idSala}/activa")]
    [ProducesResponseType(typeof(Reserva), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySalaActiva(int idSala)
    {
        var reserva = await _reservaRepo.GetBySalaActivaAsync(idSala);
        return reserva is null ? NotFound() : Ok(reserva);
    }

    /// <summary>
    /// Registra una nueva reserva, ocupa la sala y genera un código QR de acceso.
    /// </summary>
    /// <param name="dto">Datos para la apertura de la reserva.</param>
    /// <response code="201">Reserva creada exitosamente. Incluye el QR en formato Base64.</response>
    /// <response code="400">Si la sala ya está ocupada o los datos son inválidos.</response>
    /// <response code="404">Si la sala especificada no existe.</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Crear([FromBody] CrearReservaDto dto)
    {
        var sala = await _salaRepo.GetByIdAsync(dto.IdSala);
        if (sala is null) return NotFound("Sala no encontrada");
        if (sala.Estado != "Disponible") return BadRequest("La sala no está disponible");

        var reserva = new Reserva
        {
            IdSala = dto.IdSala,
            IdUsuario = dto.IdUsuario,
            FechaHoraInicio = dto.FechaHoraInicio,
            FechaHoraFin = dto.FechaHoraFin,
            CantidadPersonas = dto.CantidadPersonas,
            EstadoReserva = "Activa",
            HoraLlegada = DateTime.UtcNow,
            ValorTotal = 0
        };

        await _reservaRepo.AddAsync(reserva);

        sala.Estado = "Ocupada";
        await _salaRepo.UpdateAsync(sala);

        var qrBase64 = _qrService.GenerarQrBase64(dto.IdSala);

        return CreatedAtAction(nameof(GetById), new { id = reserva.IdReserva }, new
        {
            reserva.IdReserva,
            reserva.IdSala,
            reserva.EstadoReserva,
            reserva.FechaHoraInicio,
            reserva.FechaHoraFin,
            qrBase64,
            qrDataUrl = $"data:image/png;base64,{qrBase64}"
        });
    }

    /// <summary>
    /// Finaliza una reserva activa, calcula el valor total a pagar y libera la sala.
    /// </summary>
    /// <param name="id">ID de la reserva a cerrar.</param>
    /// <param name="dto">Datos de finalización (hora de salida).</param>
    /// <response code="200">Reserva cerrada con el cálculo del total realizado.</response>
    /// <response code="400">Si la reserva ya estaba cerrada o hay inconsistencia en los datos.</response>
    /// <response code="404">Si la reserva o la sala asociada no existen.</response>
    [HttpPatch("{id}/cerrar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cerrar(int id, [FromBody] CerrarReservaDto dto)
    {
        var reserva = await _reservaRepo.GetByIdAsync(id);
        if (reserva is null) return NotFound();
        if (reserva.EstadoReserva != "Activa") return BadRequest("La reserva ya está cerrada");

        var sala = await _salaRepo.GetByIdAsync(reserva.IdSala);
        if (sala is null) return NotFound("Sala no encontrada");

        var horasUsadas = (decimal)(dto.HoraSalida - reserva.FechaHoraInicio).TotalHours;
        reserva.ValorTotal = Math.Round(horasUsadas * sala.PrecioHora, 2);
        reserva.HoraSalida = dto.HoraSalida;
        reserva.EstadoReserva = "Cerrada";

        await _reservaRepo.UpdateAsync(reserva);

        sala.Estado = "Disponible";
        await _salaRepo.UpdateAsync(sala);

        return Ok(new { reserva.IdReserva, reserva.ValorTotal, reserva.EstadoReserva });
    }
}