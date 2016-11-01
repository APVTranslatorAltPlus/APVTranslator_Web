using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(APVTranslator_Web.Startup))]
namespace APVTranslator_Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
