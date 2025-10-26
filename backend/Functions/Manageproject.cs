using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PortfolioBackend.Models;
using System;
using System.Data;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace PortfolioBackend.Functions
{
    public class ManageProject
    {
        private readonly ILogger<ManageProject> _logger;

        public ManageProject(ILogger<ManageProject> logger)
        {
            _logger = logger;
        }

        // POST: Crear nuevo proyecto
        [Function("CreateProject")]
        public async Task<HttpResponseData> CreateProject(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects")] 
            HttpRequestData req)
        {
            _logger.LogInformation("CreateProject function triggered");

            try
            {
                // Leer el body de la request
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var project = JsonConvert.DeserializeObject<Project>(requestBody);

                if (project == null || string.IsNullOrEmpty(project.Title))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Invalid project data");
                    return badRequest;
                }

                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                int newProjectId = 0;

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("sp_InsertProject", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Agregar parámetros
                        command.Parameters.AddWithValue("@Title", project.Title);
                        command.Parameters.AddWithValue("@Description", project.Description ?? "");
                        command.Parameters.AddWithValue("@ShortDescription", 
                            (object)project.ShortDescription ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Technologies", 
                            project.Technologies != null 
                                ? JsonConvert.SerializeObject(project.Technologies) 
                                : DBNull.Value);
                        command.Parameters.AddWithValue("@ImageUrl", 
                            (object)project.ImageUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@GithubUrl", 
                            (object)project.GithubUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@DemoUrl", 
                            (object)project.DemoUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@StartDate", 
                            (object)project.StartDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@EndDate", 
                            (object)project.EndDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Featured", project.Featured);
                        command.Parameters.AddWithValue("@Category", 
                            (object)project.Category ?? DBNull.Value);
                        command.Parameters.AddWithValue("@OrderIndex", project.OrderIndex);
                        command.Parameters.AddWithValue("@Context", 
                            (object)project.Context ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Problem", 
                            (object)project.Problem ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Objective", 
                            (object)project.Objective ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ChartConfig", 
                            project.ChartConfig != null 
                                ? JsonConvert.SerializeObject(project.ChartConfig) 
                                : DBNull.Value);

                        var result = await command.ExecuteScalarAsync();
                        newProjectId = Convert.ToInt32(result);
                    }
                }

                var response = req.CreateResponse(HttpStatusCode.Created);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                
                var apiResponse = new ApiResponse<object>
                {
                    Success = true,
                    Data = new { ProjectId = newProjectId },
                    Count = 1,
                    Message = "Project created successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating project: {ex.Message}");
                
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync($"Error: {ex.Message}");
                return errorResponse;
            }
        }

        // PUT: Actualizar proyecto existente
        [Function("UpdateProject")]
        public async Task<HttpResponseData> UpdateProject(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "projects/{id}")] 
            HttpRequestData req,
            int id)
        {
            _logger.LogInformation($"UpdateProject function triggered for ID: {id}");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var project = JsonConvert.DeserializeObject<Project>(requestBody);

                if (project == null)
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Invalid project data");
                    return badRequest;
                }

                var connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
                int rowsAffected = 0;

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("sp_UpdateProject", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@ProjectId", id);
                        command.Parameters.AddWithValue("@Title", 
                            (object)project.Title ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Description", 
                            (object)project.Description ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ShortDescription", 
                            (object)project.ShortDescription ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Technologies", 
                            project.Technologies != null 
                                ? JsonConvert.SerializeObject(project.Technologies) 
                                : DBNull.Value);
                        command.Parameters.AddWithValue("@ImageUrl", 
                            (object)project.ImageUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@GithubUrl", 
                            (object)project.GithubUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@DemoUrl", 
                            (object)project.DemoUrl ?? DBNull.Value);
                        command.Parameters.AddWithValue("@StartDate", 
                            (object)project.StartDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@EndDate", 
                            (object)project.EndDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Featured", 
                            (object)(project.Featured ? 1 : (object)DBNull.Value));
                        command.Parameters.AddWithValue("@Category", 
                            (object)project.Category ?? DBNull.Value);
                        command.Parameters.AddWithValue("@OrderIndex", 
                            (object)project.OrderIndex);
                        command.Parameters.AddWithValue("@Context", 
                            (object)project.Context ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Problem", 
                            (object)project.Problem ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Objective", 
                            (object)project.Objective ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ChartConfig", 
                            project.ChartConfig != null 
                                ? JsonConvert.SerializeObject(project.ChartConfig) 
                                : DBNull.Value);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                rowsAffected = reader.GetInt32(0);
                            }
                        }
                    }
                }

                if (rowsAffected == 0)
                {
                    var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFound.WriteStringAsync($"Project with ID {id} not found");
                    return notFound;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                
                var apiResponse = new ApiResponse<object>
                {
                    Success = true,
                    Data = new { ProjectId = id, RowsAffected = rowsAffected },
                    Count = 1,
                    Message = "Project updated successfully"
                };

                await response.WriteStringAsync(JsonConvert.SerializeObject(apiResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating project: {ex.Message}");
                
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync($"Error: {ex.Message}");
                return errorResponse;
            }
        }
    }
}