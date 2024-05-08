using System.Web.Http;
using System.Web.Http.Results;

namespace WebApplication1.Controllers
{
    public class HomeController : BaseApiController
    {
        [HttpGet, Route("")]
        public RedirectResult Index()
        {
            return Redirect(Request.RequestUri.AbsoluteUri + "Views/Index.html");
        }
    }
}
