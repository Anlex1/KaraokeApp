using QRCoder;

namespace KaraokeApp.Infrastructure.Services;

public class QrService
{
    public string GenerarQrBase64(int idSala)
    {
        // La URL que escaneará el cliente apunta a la sala
        var contenido = $"karaokeapp://sala/{idSala}";

        using var qrGenerator = new QRCodeGenerator();
        using var qrData = qrGenerator.CreateQrCode(contenido, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrData);

        var bytes = qrCode.GetGraphic(10);
        return Convert.ToBase64String(bytes);
    }
}