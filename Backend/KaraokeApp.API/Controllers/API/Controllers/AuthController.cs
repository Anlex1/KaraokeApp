using KaraokeApp.Core.DTOs.Usuario;
using KaraokeApp.Core.Interfaces;
using KaraokeApp.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioRepository _repo;
    private readonly TokenService _tokenService;

    public AuthController(IUsuarioRepository repo, TokenService tokenService)
    {
        _repo = repo;
        _tokenService = tokenService;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
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