using KaraokeApp.Core.DTOs.Usuario;
using KaraokeApp.Core.Entities;
using KaraokeApp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

/// <summary>
/// Controlador para la administración de usuarios, gestión de roles y control de acceso.
/// </summary>
/// <remarks>
/// Todas las operaciones en este controlador están restringidas exclusivamente al rol de Administrador.
/// </remarks>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioRepository _repo;

    /// <summary>
    /// Constructor del controlador de Usuarios.
    /// </summary>
    public UsuarioController(IUsuarioRepository repo)
    {
        _repo = repo;
    }

    /// <summary>
    /// Obtiene el listado completo de todos los usuarios registrados en el sistema.
    /// </summary>
    /// <returns>Una lista de usuarios.</returns>
    /// <response code="200">Retorna la lista de usuarios exitosamente.</response>
    /// <response code="401">No autorizado. Requiere un token válido.</response>
    /// <response code="403">Prohibido. Solo el Administrador puede ver esta lista.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Usuario>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _repo.GetAllAsync());
    }

    /// <summary>
    /// Obtiene la información detallada de un usuario por su identificador único.
    /// </summary>
    /// <param name="id">ID del usuario.</param>
    /// <response code="200">Retorna el usuario solicitado.</response>
    /// <response code="404">Si el usuario no existe en la base de datos.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Usuario), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario = await _repo.GetByIdAsync(id);
        return usuario is null ? NotFound() : Ok(usuario);
    }

    /// <summary>
    /// Filtra y obtiene usuarios según su rol asignado (Admin, Empleado, Cliente).
    /// </summary>
    /// <param name="rol">Nombre del rol a filtrar.</param>
    /// <response code="200">Retorna la lista de usuarios con el rol especificado.</response>
    [HttpGet("rol/{rol}")]
    [ProducesResponseType(typeof(IEnumerable<Usuario>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByRol(string rol) =>
        Ok(await _repo.GetByRoleAsync(rol));

    /// <summary>
    /// Registra un nuevo usuario en el sistema con contraseña encriptada.
    /// </summary>
    /// <remarks>
    /// La contraseña se procesa mediante BCrypt antes de ser almacenada. 
    /// El estado inicial por defecto es 'Activo'.
    /// </remarks>
    /// <param name="dto">Datos de registro del usuario.</param>
    /// <response code="201">Usuario creado exitosamente.</response>
    /// <response code="400">Si los datos de registro son inválidos o el username ya existe.</response>
    [HttpPost]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Actualiza la información de perfil o el estado de un usuario existente.
    /// </summary>
    /// <param name="id">ID del usuario a actualizar.</param>
    /// <param name="dto">Nuevos datos del usuario.</param>
    /// <response code="204">Actualización realizada correctamente.</response>
    /// <response code="404">Si el usuario no existe.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Cambia el estado del usuario a 'Baneado', impidiendo su inicio de sesión futuro.
    /// </summary>
    /// <param name="id">ID del usuario a banear.</param>
    /// <response code="204">Estado actualizado a 'Baneado' correctamente.</response>
    /// <response code="404">Si el usuario no existe.</response>
    [HttpPatch("{id}/banear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Banear(int id)
    {
        var usuario = await _repo.GetByIdAsync(id);
        if (usuario is null) return NotFound();

        usuario.Estado = "Baneado";
        await _repo.UpdateAsync(usuario);
        return NoContent();
    }
}