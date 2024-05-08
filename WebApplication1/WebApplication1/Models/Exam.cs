using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public Professor Professor { get; set; }
        public string Subject { get; set; }
        public DateTime ExamDateTime { get; set; }
        public string ClassroomName { get; set; }
        public string ExamSessionName { get; set; }
    }
}