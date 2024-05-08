using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using WebApplication1.Models;

namespace WebApplication1.App_Start
{
    public static class DB
    {
        // Fields
        private static readonly string studentsPaths = HostingEnvironment.MapPath("~/App_Data/Students.json");
        private static readonly string professorsPaths = HostingEnvironment.MapPath("~/App_Data/Professors.json");
        private static readonly string adminsPaths = HostingEnvironment.MapPath("~/App_Data/Admins.json");
        private static readonly string examsPaths = HostingEnvironment.MapPath("~/App_Data/Exams.json");
        private static readonly string examResultsPaths = HostingEnvironment.MapPath("~/App_Data/ExamResults.json");
        private static readonly JsonSerializerSettings JsonSerializerSettings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
            PreserveReferencesHandling = PreserveReferencesHandling.Objects,
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        };

        // Properties
        public static List<Student> Students { get; private set; } = LoadFile<Student>(studentsPaths);
        public static List<Professor> Professors { get; private set; } = LoadFile<Professor>(professorsPaths);
        public static List<Administrator> Admins { get; private set; } = LoadFile<Administrator>(adminsPaths);
        public static List<Exam> Exams { get; private set; } = LoadFile<Exam>(examsPaths);
        public static List<ExamResult> ExamResults { get; private set; } = LoadFile<ExamResult>(examResultsPaths);
        public static List<Person> Users
        {
            get
            {
                List<Person> users = new List<Person>();
                return users.Concat(Admins).Concat(Students).Concat(Professors).ToList();
            }
        }

        // Methods
      
        public static void Save()
        {
            WriteFile(studentsPaths, Students);
            WriteFile(professorsPaths, Professors);
            WriteFile(adminsPaths, Admins);
            WriteFile(examsPaths, Exams);
            WriteFile(examResultsPaths, ExamResults);
        }

        private static List<T> LoadFile<T>(string path)
        {
            using (StreamReader sr = new StreamReader(path))
            {
                return JsonConvert.DeserializeObject<List<T>>(sr.ReadToEnd());
            }
        }

        private static void WriteFile(string path, object data)
        {
            using (StreamWriter sw = new StreamWriter(path))
            {
                sw.WriteLine(JsonConvert.SerializeObject(data, JsonSerializerSettings));
            }
        }
    }
}