using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.Enumerations;

namespace WebApplication1.Models
{
    public abstract class Person
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
        public bool Deleted { get; set; }
    }
}