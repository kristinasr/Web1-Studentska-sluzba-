using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class ExamResult
    {
        public int Id { get; set; }
        public Exam Exam { get; set; }
        public Student Student { get; set; }
        public int Grade { get; set; }
        public bool Reviewed { get; set; }
    }
}