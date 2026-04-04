using KaraokeApp.Core.DTOs.Reserva;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin, Empleado")]
public class ReservaController : ControllerBase
{
    private readonly IReservaRepository _reservaRepo;
    private readonly ISalaRepository _salaRepo;
    private readonly QrService _qrService;

    public ReservaController(IReservaRepository reservaRepo, ISalaRepository salaRepo, QrService qrService)
    {
        _reservaRepo = reservaRepo;
        _salaRepo = salaRepo;
        _qrService = qrService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _reservaRepo.GetAllAsync());
    }

    [HttpGet("activas")]
    public async Task<IActionResult> GetActivas()
    {
        return Ok(await _reservaRepo.GetActivasAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var reserva = await _reservaRepo.GetByIdAsync(id);
        return reserva is null ? NotFound() : Ok(reserva);
    }

    [AllowAnonymous]
    [HttpGet("sala/{idSala}/activa")]
    public async Task<IActionResult> GetBySalaActiva(int idSala)
    {
        var reserva = await _reservaRepo.GetBySalaActivaAsync(idSala);
        return reserva is null ? NotFound() : Ok(reserva);
    }

    [HttpPost]
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

        // Generar QR al crear la reserva
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

    [HttpPatch("{id}/cerrar")]
    public async Task<IActionResult> Cerrar(int id, [FromBody] CerrarReservaDto dto)
    {
        var reserva = await _reservaRepo.GetByIdAsync(id);
        if (reserva is null) return NotFound();
        if (reserva.EstadoReserva != "Activa") return BadRequest("La reserva ya está cerrada");

        var sala = await _salaRepo.GetByIdAsync(reserva.IdSala);
        if (sala is null) return NotFound("Sala no encontrada");

        // Calcular valor por tiempo usado
        var horasUsadas = (decimal)(dto.HoraSalida - reserva.FechaHoraInicio).TotalHours;
        reserva.ValorTotal = Math.Round(horasUsadas * sala.PrecioHora, 2);
        reserva.HoraSalida = dto.HoraSalida;
        reserva.EstadoReserva = "Cerrada";

        await _reservaRepo.UpdateAsync(reserva);

        // Liberar sala
        sala.Estado = "Disponible";
        await _salaRepo.UpdateAsync(sala);

        return Ok(new { reserva.IdReserva, reserva.ValorTotal, reserva.EstadoReserva });
    }
}