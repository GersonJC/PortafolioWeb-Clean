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
    public class GetProjects
    {
        private readonly ILogger<GetProjects> _logger;

        public GetProjects(ILogger<GetProjects> logger)
        {
            _logger = logger;
        }

        [Function("GetProjects")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "projects")] HttpRequestData req)
        {
            _logger.LogInformation("GetProjects function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                var category = query["category"];
                var featured = query["featured"];

                var projects = new List<Project>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var sql = "SELECT * FROM ds_Projects WHERE 1=1";
                    
                    if (!string.IsNullOrEmpty(category))
                    {
                        sql += " AND Category = @Category";
                    }
                    
                    if (!string.IsNullOrEmpty(featured))
                    {
                        sql += " AND Featured = @Featured";
                    }
                    
                    sql += " ORDER BY OrderIndex ASC, StartDate DESC";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        if (!string.IsNullOrEmpty(category))
                        {
                            command.Parameters.AddWithValue("@Category", category);
                        }
                        
                        if (!string.IsNullOrEmpty(featured))
                        {
                            command.Parameters.AddWithValue("@Featured", featured.ToLower() == "true" ? 1 : 0);
                        }

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var project = new Project
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Title = reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.GetString(reader.GetOrdinal("Description")),
                                    ShortDescription = reader.IsDBNull(reader.GetOrdinal("ShortDescription")) 
                                        ? null 
                                        : reader.GetString(reader.GetOrdinal("ShortDescription")),
                                    Technologies = reader.IsDBNull(reader.GetOrdinal("Technologies"))
                                        ? new List<string>()
                                        : JsonConvert.DeserializeObject<List<string>>(reader.GetString(reader.GetOrdinal("Technologies"))),
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
                                    OrderIndex = reader.GetInt32(reader.GetOrdinal("OrderIndex"))
                                };

                                projects.Add(project);
                            }
                        }
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                
                var apiResponse = new ApiResponse<List<Project>>
                {
                    Success = true,
                    Data = projects,
                    Count = projects.Count,
                    Message = "Projects retrieved successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetProjects: {ex.Message}");
                
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
                
                var apiResponse = new ApiResponse<List<Project>>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving projects: {ex.Message}"
                };

                await errorResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return errorResponse;
            }
        }
    }
}