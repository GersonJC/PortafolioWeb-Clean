using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PortfolioBackend.Models;
using System.Net;

namespace PortfolioBackend.Functions
{
    public class PostContact
    {
        private readonly ILogger<PostContact> _logger;

        public PostContact(ILogger<PostContact> logger)
        {
            _logger = logger;
        }

        [Function("PostContact")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequestData req)
        {
            _logger.LogInformation("PostContact function triggered");

            try
            {
                // Leer el body de la solicitud
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var contactData = JsonConvert.DeserializeObject<ContactMessage>(requestBody);

                // Validaciones básicas
                if (contactData == null ||
                    string.IsNullOrWhiteSpace(contactData.Name) ||
                    string.IsNullOrWhiteSpace(contactData.Email) ||
                    string.IsNullOrWhiteSpace(contactData.Subject) ||
                    string.IsNullOrWhiteSpace(contactData.Message))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new
                    {
                        success = false,
                        message = "Todos los campos son requeridos"
                    });
                    return badRequestResponse;
                }

                // Validar formato de email
                if (!IsValidEmail(contactData.Email))
                {
                    var badEmailResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badEmailResponse.WriteAsJsonAsync(new
                    {
                        success = false,
                        message = "El formato del email no es válido"
                    });
                    return badEmailResponse;
                }

                // Obtener IP del cliente
                var ipAddress = req.Headers.TryGetValues("X-Forwarded-For", out var values)
                    ? values.FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim()
                    : "Unknown";

                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var sql = @"
                        INSERT INTO ds_ContactMessages 
                        (Name, Email, Subject, Message, CreatedAt, IpAddress, Status)
                        VALUES 
                        (@Name, @Email, @Subject, @Message, @CreatedAt, @IpAddress, @Status);
                        SELECT CAST(SCOPE_IDENTITY() as int);";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Name", contactData.Name);
                        command.Parameters.AddWithValue("@Email", contactData.Email);
                        command.Parameters.AddWithValue("@Subject", contactData.Subject);
                        command.Parameters.AddWithValue("@Message", contactData.Message);
                        command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                        command.Parameters.AddWithValue("@IpAddress", ipAddress ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Status", "Pendiente");

                        var newId = (int)await command.ExecuteScalarAsync();

                        _logger.LogInformation($"Contact message saved with ID: {newId}");

                        var response = req.CreateResponse(HttpStatusCode.Created);
                        await response.WriteAsJsonAsync(new
                        {
                            success = true,
                            message = "Mensaje enviado exitosamente",
                            id = newId
                        });

                        return response;
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError($"SQL Error: {sqlEx.Message}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Error al guardar el mensaje en la base de datos"
                });
                return errorResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Error al procesar la solicitud"
                });
                return errorResponse;
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}