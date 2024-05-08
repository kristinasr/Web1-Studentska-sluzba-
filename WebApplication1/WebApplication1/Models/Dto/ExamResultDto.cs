using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Dto
{
    public class ExamResultDto
    {
        public int Id { get; set; }
        public string ExamName { get; set; }
        public string Student { get; set; }
        public string Index { get; set; }
        public int Grade { get; set; }
        public bool Reviewed { get; set; }
        public string ExamSessionName { get; set; }
    }
}