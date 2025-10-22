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
    public class GetSkills
    {
        private readonly ILogger<GetSkills> _logger;

        public GetSkills(ILogger<GetSkills> logger)
        {
            _logger = logger;
        }

        [Function("GetSkills")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "skills")] HttpRequestData req)
        {
            _logger.LogInformation("GetSkills function triggered");

            try
            {
                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                var category = query["category"];

                var skills = new List<Skill>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var sql = "SELECT * FROM ds_Skills WHERE 1=1";

                    if (!string.IsNullOrEmpty(category))
                    {
                        sql += " AND Category = @Category";
                    }

                    sql += " ORDER BY Category, OrderIndex ASC";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        if (!string.IsNullOrEmpty(category))
                        {
                            command.Parameters.AddWithValue("@Category", category);
                        }

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var skill = new Skill
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    Name = reader.GetString(reader.GetOrdinal("Name")),
                                    Category = reader.GetString(reader.GetOrdinal("Category")),
                                    Level = reader.GetInt32(reader.GetOrdinal("Level")),
                                    YearsExperience = reader.GetDecimal(reader.GetOrdinal("YearsExperience")),
                                    ProjectsCount = reader.GetInt32(reader.GetOrdinal("ProjectsCount")),
                                    Icon = reader.IsDBNull(reader.GetOrdinal("Icon"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Icon"))
                                };

                                skills.Add(skill);
                            }
                        }
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                response.Headers.Add("Access-Control-Allow-Origin", "*");

                var apiResponse = new ApiResponse<List<Skill>>
                {
                    Success = true,
                    Data = skills,
                    Count = skills.Count,
                    Message = "Skills retrieved successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetSkills: {ex.Message}");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");

                var apiResponse = new ApiResponse<List<Skill>>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving skills: {ex.Message}"
                };

                await errorResponse.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return errorResponse;
            }
        }
    }
}