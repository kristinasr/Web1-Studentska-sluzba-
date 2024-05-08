using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.Enumerations;

namespace WebApplication1.Models.Dto
{
    public class UserDto
    {
        public string Username { get; set; }
        public Role Role { get; set; }
    }
}