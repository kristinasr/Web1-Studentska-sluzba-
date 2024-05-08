using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using WebApplication1.App_Start;
using WebApplication1.Models;
using WebApplication1.Models.Dto;

namespace WebApplication1.Controllers
{
    public class LoginController : BaseApiController
    {
        [HttpGet, Route("api/Login")]
        public IHttpActionResult Get()
        {
            Person user = GetCurrentUser();
            if (user is null)
                return Ok(new UserDto { Username = string.Empty, Role = Models.Enumerations.Role.Undefined });

            return Ok(new UserDto { Username = user.Username, Role = user.Role });
        }

        [HttpPost, Route("api/Login/SignIn")]
        public IHttpActionResult SignIn([FromBody] LoginDto loginData)
        {
            Person user = DB.Users.Find(x => x.Username == loginData.Username
                                                      && x.Password == loginData.Password);
            if (user is null)
                return BadRequest("Pogresno korisnicko ime i/ili lozinka.");

            if (user.Deleted)
                return BadRequest("Korisnik je obrisan!");
            UserDto signedData = new UserDto
            {
                Role = user.Role,
                Username = user.Username
            };

            HttpContext.Current.Session["User"] = user as Person;
            return Ok(signedData);
        }

        [HttpGet, Route("api/Login/SignOut")]
        public IHttpActionResult SignOut()
        {
            try
            {
                HttpContext.Current.Session.Abandon();
                return Ok();
            }
            catch
            {
                return InternalServerError();
            }
        }
    }
}