using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Dto
{
    public class ExamDto
    {
        public int Id { get; set; }
        public string Professor { get; set; }
        public string Subject { get; set; }
        public DateTime ExamDateTime { get; set; }
        public string ClassroomName { get; set; }
        public string ExamSessionName { get; set; }
        public bool SignedUp { get; set; }
    }
}