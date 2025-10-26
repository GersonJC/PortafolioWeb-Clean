using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PortfolioBackend.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Threading.Tasks;

namespace PortfolioBackend.Functions
{
    public class GetProjectById
    {
        private readonly ILogger<GetProjectById> _logger;

        public GetProjectById(ILogger<GetProjectById> logger)
        {
            _logger = logger;
        }

        [Function("GetProjectById")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "projects/{id}")] 
            HttpRequestData req,
            int id)
        {
            _logger.LogInformation($"GetProjectById function triggered for ID: {id}");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                Project project = null;

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    // Usar Stored Procedure
                    using (var command = new SqlCommand("sp_GetProjectById", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ProjectId", id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                project = new Project
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Title = reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.GetString(reader.GetOrdinal("Description")),
                                    ShortDescription = reader.IsDBNull(reader.GetOrdinal("ShortDescription"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("ShortDescription")),
                                    Technologies = reader.IsDBNull(reader.GetOrdinal("Technologies"))
                                        ? new List<string>()
                                        : JsonConvert.DeserializeObject<List<string>>(
                                            reader.GetString(reader.GetOrdinal("Technologies"))),
                                    ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                    GithubUrl = reader.IsDBNull(reader.GetOrdinal("GithubUrl"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("GithubUrl")),
                                    DemoUrl = reader.IsDBNull(reader.GetOrdinal("DemoUrl"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("DemoUrl")),
                                    StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate"))
                                        ? null
                                        : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate"))
                                        ? null
                                        : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                    Featured = reader.GetBoolean(reader.GetOrdinal("Featured")),
                                    Category = reader.IsDBNull(reader.GetOrdinal("Category"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Category")),
                                    OrderIndex = reader.GetInt32(reader.GetOrdinal("OrderIndex")),
                                    // Nuevos campos para la página de detalle
                                    Context = reader.IsDBNull(reader.GetOrdinal("Context"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Context")),
                                    Problem = reader.IsDBNull(reader.GetOrdinal("Problem"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Problem")),
                                    Objective = reader.IsDBNull(reader.GetOrdinal("Objective"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Objective")),
                                    ChartConfig = reader.IsDBNull(reader.GetOrdinal("ChartConfig"))
                                        ? null
                                        : JsonConvert.DeserializeObject<ProjectChartConfig>(
                                            reader.GetString(reader.GetOrdinal("ChartConfig")))
                                };
                            }
                        }
                    }
                }

                if (project == null)
                {
                    _logger.LogWarning($"Project with ID {id} not found");
                    
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    notFoundResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
                    
                    var apiResponse = new ApiResponse<Project>
                    {
                        Success = false,
                        Data = null,
                        Message = $"Project with ID {id} not found",
                        Count = 0
                    };

                    await notFoundResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                
                var successResponse = new ApiResponse<Project>
                {
                    Success = true,
                    Data = project,
                    Count = 1,
                    Message = "Project retrieved successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(successResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetProjectById: {ex.Message}");
                
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
                
                var apiResponse = new ApiResponse<Project>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving project: {ex.Message}"
                };

                await errorResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return errorResponse;
            }
        }
    }
}