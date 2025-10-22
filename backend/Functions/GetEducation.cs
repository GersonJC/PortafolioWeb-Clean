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
    public class GetEducation
    {
        private readonly ILogger<GetEducation> _logger;

        public GetEducation(ILogger<GetEducation> logger)
        {
            _logger = logger;
        }

        [Function("GetEducation")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "education")] HttpRequestData req)
        {
            _logger.LogInformation("GetEducation function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                var educationList = new List<Education>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    var sql = "SELECT * FROM ds_Education ORDER BY OrderIndex ASC";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var education = new Education
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Institution = reader.GetString(reader.GetOrdinal("Institution")),
                                    Degree = reader.GetString(reader.GetOrdinal("Degree")),
                                    Field = reader.IsDBNull(reader.GetOrdinal("Field"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Field")),
                                    StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate"))
                                        ? null
                                        : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                    IsCurrent = reader.GetBoolean(reader.GetOrdinal("IsCurrent")),
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Description")),
                                    LogoUrl = reader.IsDBNull(reader.GetOrdinal("LogoUrl"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("LogoUrl"))
                                };

                                educationList.Add(education);
                            }
                        }
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                response.Headers.Add("Access-Control-Allow-Origin", "*");

                var apiResponse = new ApiResponse<List<Education>>
                {
                    Success = true,
                    Data = educationList,
                    Count = educationList.Count,
                    Message = "Education retrieved successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetEducation: {ex.Message}");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");

                var apiResponse = new ApiResponse<List<Education>>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving education: {ex.Message}"
                };

                await errorResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return errorResponse;
            }
        }
    }
}