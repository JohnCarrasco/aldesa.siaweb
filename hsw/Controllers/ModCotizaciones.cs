using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using General.Librerias.AccesoDatos.MySQL;
using hsw.Filters; //DaSQL

namespace hsw.Controllers
{
    [FiltroAutenticacion]
    public class ModCotizacionesController : Controller
    {
        #pragma warning disable CS8600
        #pragma warning disable CS8602

        #region ManteCotizaciones
        public ActionResult ManteCotizaciones()
        {
            return View();
        }
        public string ManteCotizacionesCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteCotizacionesCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteCotizacionesGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteCotizacionesCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        #endregion ManteCotizaciones

        #region ManteServicioSegmentos
        public ActionResult ManteServicioSegmentos()
        {
            return View();
        }
        public string ManteServicioSegmentosCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioSegmentosCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteServicioSegmentosGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioSegmentosCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        #endregion ManteServicioSegmentos

        #region ManteServicioFamilia
        public ActionResult ManteServicioFamilia()
        {
            return View();
        }
        public string ManteServicioFamiliaCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioFamiliaCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteServicioFamiliaGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioFamiliaCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        #endregion ManteServicioFamilia
    }
}
