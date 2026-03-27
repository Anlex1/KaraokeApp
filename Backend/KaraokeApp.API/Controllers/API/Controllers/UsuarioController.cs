using KaraokeApp.Core.DTOs.Usuario;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioRepository _repo;

    public UsuarioController(IUsuarioRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _repo.GetAllAsync());
    }        

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario = await _repo.GetByIdAsync(id);
        return usuario is null ? NotFound() : Ok(usuario);
    }

    [HttpGet("rol/{rol}")]
    public async Task<IActionResult> GetByRol(string rol) =>
        Ok(await _repo.GetByRoleAsync(rol));

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearUsuarioDto dto)
    {
        var usuario = new Usuario
        {
            Nombre = dto.Nombre,
            Rol = dto.Rol,
            Username = dto.Username,
            Contraseña = BCrypt.Net.BCrypt.HashPassword(dto.Contraseña),
            Correo = dto.Correo,
            Estado = "Activo"
        };
        await _repo.AddAsync(usuario);
        return CreatedAtAction(nameof(GetById), new { id = usuario.IdUsuario }, new UsuarioResponseDto
        {
            IdUsuario = usuario.IdUsuario,
            Nombre = usuario.Nombre,
            Rol = usuario.Rol,
            Username = usuario.Username,
            Correo = usuario.Correo,
            Estado = usuario.Estado
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarUsuarioDto dto)
    {
        var usuario = await _repo.GetByIdAsync(id);
        if (usuario is null) return NotFound();

        if (dto.Nombre is not null) usuario.Nombre = dto.Nombre;
        if (dto.Correo is not null) usuario.Correo = dto.Correo;
        if (dto.Estado is not null) usuario.Estado = dto.Estado;

        await _repo.UpdateAsync(usuario);
        return NoContent();
    }

    [HttpPatch("{id}/banear")]
    public async Task<IActionResult> Banear(int id)
    {
        var usuario = await _repo.GetByIdAsync(id);
        if (usuario is null) return NotFound();

        usuario.Estado = "Baneado";
        await _repo.UpdateAsync(usuario);
        return NoContent();
    }
}