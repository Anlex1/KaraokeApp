# 🎤 KaraokeApp — Backend

Sistema de gestión integral para salas de karaoke. API REST construida con .NET 10, Entity Framework Core y PostgreSQL en Supabase.

---

## 🛠️ Tecnologías

- .NET 10
- Entity Framework Core
- PostgreSQL (Supabase)
- JWT Bearer Authentication
- Scalar (documentación de API)
- QRCoder
- BCrypt.Net

---

## 📋 Requisitos previos

Antes de ejecutar el proyecto se debe asegurar de tener instalado:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Git](https://git-scm.com/)
- Acceso a un proyecto de [Supabase](https://supabase.com) con la connection string

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa tus datos:
```bash
cp KaraokeApp.API/appsettings.example.json KaraokeApp.API/appsettings.json
```

Se debe editar el archivo `appsettings.json` con el connection string de Supabase y la clave JWT:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.TUPROYECTO.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=TUPASSWORD;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "TU_CLAVE_SECRETA_MINIMO_32_CARACTERES",
    "Issuer": "KaraokeApp",
    "Audience": "KaraokeAppUsers",
    "ExpiresInHours": 8
  }
}
```

### 3. Restaurar dependencias
```bash
dotnet restore
```

### 4. Aplicar migraciones a la base de datos
```bash
dotnet ef database update --project KaraokeApp.Infrastructure --startup-project KaraokeApp.API
```

### 5. Ejecutar el proyecto
```bash
dotnet run --project KaraokeApp.API
```

---

## 📚 Documentación de la API

Una vez ejecutado el proyecto, se puede acceder a la documentación interactiva en:
```
http://localhost:5203/scalar/v1
```

---

## 🔐 Autenticación

La API usa **JWT Bearer Token**. Para acceder a los endpoints protegidos:

1. Se debe crear un usuario con `POST /api/Usuario`
2. Se debe logear en la ruta `POST /api/Auth/login`
3. Se debe copiar el token de la respuesta
4. Al intentar cualquier otro end point que requiera autorización se debe colocar el Auth type con Bearer Token

### Roles disponibles

| Rol             | Acceso                         |
|-----------------|--------------------------------|
| `Admin`         | Acceso total                   |
| `Empleado`      | Reservas, pedidos, salas       |
| `Cliente`       | Sin login — QR, menú, pedidos  |

---

## 🗄️ Estructura del proyecto
```
KaraokeApp/
├── KaraokeApp.API/             # Controllers, Program.cs, configuración
│   └── Controllers/
├── KaraokeApp.Core/            # Entidades, interfaces, DTOs
│   ├── Entities/
│   ├── Interfaces/
│   └── DTOs/
└── KaraokeApp.Infrastructure/  # DbContext, repositorios, migraciones
    ├── Data/
    ├── Repositories/
    └── Services/
```

---

## 👥 Integrantes

- Angelo Alexander Arango Graciano
- Joimar Danilo Urrego
- Selvio Bedoya Heredia