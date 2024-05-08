using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.App_Start;

namespace WebApplication1.Controllers
{
    public class ProfessorController : BaseApiController
    {
        [HttpGet, Route("api/Professor/GetSubjects")]
        public IHttpActionResult GetSubjects()
        {
            var subjects = GetProfessor(GetCurrentUser()).Subjects;
            return Ok(subjects);
        }
    }
}
