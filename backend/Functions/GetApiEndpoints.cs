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
    public class GetApiEndpoints
    {
        private readonly ILogger<GetApiEndpoints> _logger;

        public GetApiEndpoints(ILogger<GetApiEndpoints> logger)
        {
            _logger = logger;
        }

        [Function("GetApiEndpoints")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api-endpoints")] HttpRequestData req)
        {
            _logger.LogInformation("GetApiEndpoints function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                var endpoints = new List<ApiEndpoint>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    var sql = "EXEC dbo.sp_GetActiveApiEndpoints";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var endpoint = new ApiEndpoint
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Name = reader.GetString(reader.GetOrdinal("Name")),
                                    Method = reader.GetString(reader.GetOrdinal("Method")),
                                    Endpoint = reader.GetString(reader.GetOrdinal("Endpoint")),
                                    Description = reader.GetString(reader.GetOrdinal("Description")),
                                    Category = reader.IsDBNull(reader.GetOrdinal("Category"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Category")),
                                    Parameters = reader.IsDBNull(reader.GetOrdinal("Parameters"))
                                        ? null
                                        : JsonConvert.DeserializeObject<List<ApiParameter>>(reader.GetString(reader.GetOrdinal("Parameters"))),
                                    RequestBody = reader.IsDBNull(reader.GetOrdinal("RequestBody"))
                                        ? null
                                        : JsonConvert.DeserializeObject<List<ApiRequestBody>>(reader.GetString(reader.GetOrdinal("RequestBody"))),
                                    ExampleRequest = reader.IsDBNull(reader.GetOrdinal("ExampleRequest"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("ExampleRequest")),
                                    OrderIndex = reader.GetInt32(reader.GetOrdinal("OrderIndex"))
                                };

                                endpoints.Add(endpoint);
                            }
                        }
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new
                {
                    success = true,
                    data = endpoints,
                    message = "API endpoints retrieved successfully",
                    count = endpoints.Count
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new
                {
                    success = false,
                    data = new List<ApiEndpoint>(),
                    message = $"Error: {ex.Message}",
                    count = 0
                });
                return errorResponse;
            }
        }
    }
}