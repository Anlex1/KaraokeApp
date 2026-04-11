using KaraokeApp.Core.DTOs.Usuario;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

/// <summary>
/// Controlador encargado de la autenticación y gestión de acceso de usuarios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioRepository _repo;
    private readonly TokenService _tokenService;

    /// <summary>
    /// Constructor del controlador de autenticación.
    /// </summary>
    /// <param name="repo">Repositorio para la gestión de datos de usuario.</param>
    /// <param name="tokenService">Servicio encargado de la generación de tokens JWT.</param>
    public AuthController(IUsuarioRepository repo, TokenService tokenService)
    {
        _repo = repo;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Inicia sesión en el sistema y genera un token de acceso.
    /// </summary>
    /// <remarks>
    /// Permite a los usuarios registrados obtener un token JWT válido para consumir servicios protegidos.
    /// El usuario debe estar en estado "Activo".
    /// </remarks>
    /// <param name="dto">Objeto con las credenciales de acceso (Username y Contraseña).</param>
    /// <returns>Retorna el token generado junto con la información básica del perfil del usuario.</returns>
    /// <response code="200">Retorna el token exitosamente.</response>
    /// <response code="401">Si las credenciales son incorrectas o el usuario no está activo.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var usuario = await _repo.GetByUsernameAsync(dto.Username);

        if (usuario is null || usuario.Estado != "Activo")
            return Unauthorized("Usuario no encontrado o inactivo");

        var passwordValido = BCrypt.Net.BCrypt.Verify(dto.Contraseña, usuario.Contraseña);
        if (!passwordValido)
            return Unauthorized("Contraseña incorrecta");

        var token = _tokenService.GenerarToken(usuario);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Nombre = usuario.Nombre,
            Rol = usuario.Rol
        });
    }
}