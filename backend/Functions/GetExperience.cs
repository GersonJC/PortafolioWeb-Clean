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
    public class GetExperience
    {
        private readonly ILogger<GetExperience> _logger;

        public GetExperience(ILogger<GetExperience> logger)
        {
            _logger = logger;
        }

        [Function("GetExperience")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "experience")] HttpRequestData req)
        {
            _logger.LogInformation("GetExperience function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                var experiences = new List<Experience>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    var sql = "SELECT * FROM ds_Experience ORDER BY OrderIndex ASC";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var experience = new Experience
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Company = reader.GetString(reader.GetOrdinal("Company")),
                                    Position = reader.GetString(reader.GetOrdinal("Position")),
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Description")),
                                    Technologies = reader.IsDBNull(reader.GetOrdinal("Technologies"))
                                        ? new List<string>()
                                        : JsonConvert.DeserializeObject<List<string>>(reader.GetString(reader.GetOrdinal("Technologies"))),
                                    StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate"))
                                        ? null
                                        : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                    IsCurrent = reader.GetBoolean(reader.GetOrdinal("IsCurrent")),
                                    LogoUrl = reader.IsDBNull(reader.GetOrdinal("LogoUrl"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("LogoUrl")),
                                    Location = reader.IsDBNull(reader.GetOrdinal("Location"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Location"))
                                };

                                experiences.Add(experience);
                            }
                        }
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                response.Headers.Add("Access-Control-Allow-Origin", "*");

                var apiResponse = new ApiResponse<List<Experience>>
                {
                    Success = true,
                    Data = experiences,
                    Count = experiences.Count,
                    Message = "Experience retrieved successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetExperience: {ex.Message}");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");

                var apiResponse = new ApiResponse<List<Experience>>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving experience: {ex.Message}"
                };

                await errorResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return errorResponse;
            }
        }
    }
}