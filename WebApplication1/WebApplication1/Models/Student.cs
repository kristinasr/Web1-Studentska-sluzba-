using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Student : Person
    {
        public string Index { get; set; }
        public List<Exam> EnrolledExams { get; set; } = new List<Exam>();
        public List<Exam> PassedExams { get; set; } = new List<Exam>();
        public List<Exam> FailedExams { get; set; } = new List<Exam>();
    }
}