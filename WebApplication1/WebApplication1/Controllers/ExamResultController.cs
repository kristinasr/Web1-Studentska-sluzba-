using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.App_Start;
using WebApplication1.Models;
using WebApplication1.Models.Dto;

namespace WebApplication1.Controllers
{
    public class ExamResultController : BaseApiController
    {
        [HttpGet, Route("api/ExamResult/GetResultsForProfessor")]
        public IHttpActionResult GetResultsForProfessor()
        {
            List<ExamResult> exams = DB.ExamResults.FindAll(x => x.Exam.Professor.Id == GetProfessor(GetCurrentUser()).Id);
            List<ExamResultDto> result = new List<ExamResultDto>();
            foreach (ExamResult i in exams)
            {
                result.Add(new ExamResultDto
                {
                    Id = i.Id,
                    Grade = i.Grade,
                    Student = i.Student.FirstName + " " + i.Student.LastName,
                    Reviewed = i.Reviewed,
                    ExamName = i.Exam.Subject + "-" + i.Exam.ExamSessionName,
                    Index = i.Student.Index,
                    ExamSessionName = i.Exam.ExamSessionName
                });
            }
            return Ok(result);
        }
        [HttpGet, Route("api/ExamResult/GetResultsForStudent")]
        public IHttpActionResult GetResultsForStudent()
        {
            List<ExamResult> exams = DB.ExamResults.FindAll(x =>
            {
                return x.Student.Id == GetCurrentUser().Id;
            });
            List<ExamResultDto> result = new List<ExamResultDto>();
            foreach (ExamResult i in exams)
            {
                result.Add(new ExamResultDto
                {
                    Id = i.Id,
                    Grade = i.Grade,
                    Reviewed = i.Reviewed,
                    ExamName = i.Exam.Subject,
                    ExamSessionName = i.Exam.ExamSessionName
                });
            }
            return Ok(result);
        }
        [HttpPost, Route("api/ExamResult/ReviewExam")]
        public IHttpActionResult ReviewExam([FromBody] ExamResult result)
        {
            ExamResult examresult = DB.ExamResults.Find(x => x.Id == result.Id);

            if (result.Grade >= 5 && result.Grade <= 10)
            {
                examresult.Grade = result.Grade;
                examresult.Reviewed = true;
                Save();
                return Ok();
            }
            else
            {
                return BadRequest("Ocena mora biti između 5 i 10.");
            }
        }

        //public IHttpActionResult ReviewExam([FromBody] ExamResult result)
        //{
        //    ExamResult examresult = DB.ExamResults.Find(x => x.Id == result.Id);

        //    if (result.Grade >= 5 && result.Grade <= 10)
        //    {
        //        examresult.Grade = result.Grade;
        //        examresult.Reviewed = true;
        //        Save();
        //        return Ok();
        //    }
        //    else
        //    {
        //        return BadRequest("Ocena mora biti između 5 i 10.");
        //    }
        //}



    }
}
