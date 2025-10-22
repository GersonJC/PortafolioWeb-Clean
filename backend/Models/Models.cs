using System;
using System.Collections.Generic;

namespace PortfolioBackend.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public List<string> Technologies { get; set; }
        public string ImageUrl { get; set; }
        public string GithubUrl { get; set; }
        public string DemoUrl { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool Featured { get; set; }
        public string Category { get; set; }
        public int OrderIndex { get; set; }
    }

    public class Experience
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Description { get; set; }
        public List<string> Technologies { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string LogoUrl { get; set; }
        public string Location { get; set; }
    }

    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public int Level { get; set; }
        public decimal YearsExperience { get; set; }
        public int ProjectsCount { get; set; }
        public string Icon { get; set; }
    }

    public class Education
    {
        public int Id { get; set; }
        public string Institution { get; set; }
        public string Degree { get; set; }
        public string Field { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string Description { get; set; }
        public string LogoUrl { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
        public int Count { get; set; }
    }
}