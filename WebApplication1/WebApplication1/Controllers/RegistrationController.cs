using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using WebApplication1.Models.Dto;
using WebApplication1.Controllers;
using WebApplication1.App_Start;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class RegistrationController : BaseApiController
    {


        [HttpPut, Route("api/Registration/CreateStudent")]
        public IHttpActionResult CreateStudent([FromBody] Student newUser)
        {
            bool error = false;
            string errorMessage = "Nisu dostupni sledeci parametri: ";

            if (DB.Students.Find(x => x.Username == newUser.Username) != null)
            {
                error = true;
                errorMessage += "korisnicko ime ";
            }
            if (DB.Students.Find(x => x.Email == newUser.Email) != null)
            {
                error = true;
                errorMessage += "email adresa ";
            }
            if (DB.Students.Find(x => x.Index == newUser.Index) != null)
            {
                error = true;
                errorMessage += "index ";
            }

            if (error)
                return BadRequest(errorMessage);

            newUser.Id = DB.Users.Count + 1;

            DB.Students.Add(newUser);
            Save();

            return Ok();
        }

        [HttpPut, Route("api/Registration/UpdateStudent")]

        public IHttpActionResult UpdateStudent([FromBody] Student newStudent)
        {
            Student oldStudent = DB.Students.Find(x => x.Username == newStudent.Username);

          
            if (DB.Students.Any(x => x.Email == newStudent.Email && x.Id != oldStudent.Id))
            {
                return BadRequest("Email već postoji u bazi.");
            }

            oldStudent.FirstName = newStudent.FirstName;
            oldStudent.LastName = newStudent.LastName;

            oldStudent.DateOfBirth = newStudent.DateOfBirth;
            oldStudent.Email = newStudent.Email;

            Save();

            return Ok();
        }




        /*   public IHttpActionResult UpdateStudent([FromBody] Student newStudent)
           {
               Student oldStudent = DB.Students.Find(x => x.Username == newStudent.Username);

               oldStudent.FirstName = newStudent.FirstName;
               oldStudent.LastName = newStudent.LastName;
               oldStudent.Password = newStudent.Password;
               oldStudent.DateOfBirth = newStudent.DateOfBirth;
               oldStudent.Email = newStudent.Email;

               Save();

               return Ok();
           }*/







        [HttpGet, Route("api/Registration/GetStudent/{username}")]

        public IHttpActionResult GetStudent(string username)
        {
            var student = DB.Students.Find(x => x.Username == username);
            var studentDto = new StudentDto
            {
                Index = student.Index,
                DateOfBirth = student.DateOfBirth,
                Email = student.Email,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Password = student.Password,
                Username = student.Username,
                Deleted = student.Deleted
            };
            return Ok(studentDto);
        }

        [HttpGet, Route("api/Registration/DeleteStudent/{username}")]
        public IHttpActionResult DeleteStudent(string username)
        {
            DB.Students.Find(x => x.Username == username).Deleted = true;
            Save();
            return Ok();
        }

        [HttpGet, Route("api/Registration/GetAllStudents")]
        public IHttpActionResult GetAllStudents()
        {
            var students = new List<StudentDto>();
            foreach (var student in DB.Students)
            {
                students.Add(new StudentDto
                {
                    Index = student.Index,
                    DateOfBirth = student.DateOfBirth,
                    Email = student.Email,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    Password = student.Password,
                    Username = student.Username,
                    Deleted = student.Deleted
                });
            }

            return Ok(students);
        }



    }
}