using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PortfolioBackend.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace PortfolioBackend.Functions
{
    public class GetApiDocs
    {
        private readonly ILogger<GetApiDocs> _logger;

        public GetApiDocs(ILogger<GetApiDocs> logger)
        {
            _logger = logger;
        }

        [Function("GetApiDocs")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api-docs")] HttpRequestData req)
        {
            _logger.LogInformation("GetApiDocs function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    var sql = "SELECT TOP 1 * FROM ds_ApiDocumentation";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                var apiDoc = new ApiDocumentation
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Title = reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.GetString(reader.GetOrdinal("Description")),
                                    BaseUrl = reader.GetString(reader.GetOrdinal("BaseUrl")),
                                    Technologies = reader.IsDBNull(reader.GetOrdinal("Technologies"))
                                        ? new List<string>()
                                        : JsonConvert.DeserializeObject<List<string>>(reader.GetString(reader.GetOrdinal("Technologies")))
                                };

                                var response = req.CreateResponse(HttpStatusCode.OK);
                                await response.WriteAsJsonAsync(new
                                {
                                    success = true,
                                    data = apiDoc,
                                    message = "API documentation retrieved successfully",
                                    count = 1
                                });
                                return response;
                            }
                        }
                    }
                }

                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteAsJsonAsync(new
                {
                    success = false,
                    data = (object)null,
                    message = "API documentation not found",
                    count = 0
                });
                return notFoundResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new
                {
                    success = false,
                    data = (object)null,
                    message = $"Error: {ex.Message}",
                    count = 0
                });
                return errorResponse;
            }
        }
    }
}