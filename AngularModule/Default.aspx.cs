using System;
using Tmobile.Framework.Presentation;

namespace Tmobile.Explore.Web.CostCalculator
{
    public partial class Default : TmobilePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // SSL REDIRECT
            if (!Request.IsSecureConnection && Utility.IsProduction(Request))
            {
                Response.RedirectPermanent("https://" + Request.Url.Host + Request.RawUrl);
            }
        }
    }
}