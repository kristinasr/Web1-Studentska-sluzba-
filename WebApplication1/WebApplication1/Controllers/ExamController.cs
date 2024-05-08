using System;
using System.Collections.Generic;
using System.Web.Http;
using WebApplication1.App_Start;
using WebApplication1.Models;
using WebApplication1.Models.Dto;

namespace WebApplication1.Controllers
{
    public class ExamController : BaseApiController
    {
        [HttpPut, Route("api/Exam/CreateExam")]
        public IHttpActionResult CreateExam([FromBody] Exam exam)
        {
            if (exam.ExamDateTime < DateTime.Now)
                return BadRequest("Ispit mora da bude kreiran u buducnosti!");
            exam.Id = DB.Exams.Count + 1;
            exam.Professor = GetProfessor(GetCurrentUser());
            exam.Professor.TaughtExams.Add(exam);
            DB.Exams.Add(exam);

            Save();
            return Ok();
        }

        [HttpGet, Route("api/Exam/GetUpcomingExams")]
        public IHttpActionResult GetUpcomingExams()
        {
            var student = GetStudent(GetCurrentUser());
            var exams = DB.Exams.FindAll(x => x.ExamDateTime > DateTime.Now);
            List<ExamDto> result = new List<ExamDto>();
            foreach (var exam in exams)
            {
                result.Add(new ExamDto
                {
                    ClassroomName = exam.ClassroomName,
                    ExamDateTime = exam.ExamDateTime,
                    Id = exam.Id,
                    Subject = exam.Subject,
                    ExamSessionName = exam.ExamSessionName,
                    Professor = exam.Professor.FirstName + " " + exam.Professor.LastName,
                    SignedUp = student.EnrolledExams.Exists(x => x.Id == exam.Id)
                            || student.PassedExams.Exists(x => x.Id == exam.Id)
                            || student.FailedExams.Exists(x => x.Id == exam.Id)
                });
            }
            return Ok(result);
        }

        [HttpGet, Route("api/Exam/SignUp/{examId}")]
        public IHttpActionResult SignUp(int examId)
        {
            var student = GetStudent(GetCurrentUser());
            if (student.EnrolledExams.Exists(x => x.Id == examId))
                return BadRequest("Vec ste prijavili ispit.");

            var exam = DB.Exams.Find(x => x.Id == examId);
            student.EnrolledExams.Add(exam);
            var examResult = new ExamResult
            {
                Exam = exam,
                Grade = 0,
                Id = DB.ExamResults.Count + 1,
                Reviewed = false,
                Student = student

            };
            DB.ExamResults.Add(examResult);
            Save();

            return Ok();
        }
    }
}
