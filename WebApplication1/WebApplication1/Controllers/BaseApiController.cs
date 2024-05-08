using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using WebApplication1.Models;
using WebApplication1.App_Start;

namespace WebApplication1.Controllers
{
    public abstract class BaseApiController : ApiController
    {
        protected void Save() => DB.Save();
        protected Person GetCurrentUser()
        {
            return HttpContext.Current.Session["user"] as Person;
        }
        protected Student GetStudent(Person person)
        {
            return DB.Students.Find(x => x.Id == person.Id);
        }
        protected Professor GetProfessor(Person person)
        {
            return DB.Professors.Find(x => x.Id == person.Id);
        }
    }
}