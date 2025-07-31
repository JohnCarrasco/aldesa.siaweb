using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;

namespace hsw.Filters
{
    public class FiltroAutenticacion : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.HttpContext.Session.GetString("id_cia") == null || context.HttpContext.Session.GetString("id_usr") == null)
            {
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "HSW", action = "Login" }));
            }
        }
    }
    //public class PermisoAttribute: ActionFilterAttribute
    //{
    //    public RolesPermisos Permiso { get; set; }
    //    public override void OnActionExecuting(ActionExecutingContext context)
    //    {
    //        base.OnActionExecuting(context);
    //        if (this.Permiso)
    //        {
    //            context.Result = new RedirectToRouteResult(new RouteValueDictionary(new 
    //            { 
    //                controller = "HSW", 
    //                action = "Login" 
    //            }));
    //        }
    //    }
    //}
}
