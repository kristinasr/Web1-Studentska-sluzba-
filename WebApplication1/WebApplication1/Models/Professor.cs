using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class Professor : Person
    {
        public List<string> Subjects { get; set; } = new List<string>();
        public List<Exam> TaughtExams { get; set; } = new List<Exam>();
    }
}