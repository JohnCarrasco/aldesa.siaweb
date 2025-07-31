using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using General.Librerias.AccesoDatos.MySQL; //DaSQL

namespace hsw.Controllers
{
    public class ModTablasController : Controller
    {
#pragma warning disable CS8600
#pragma warning disable CS8602

        #region ManteCliPro
        public ActionResult ManteCliPro()
        {
            return View();
        }
        public string ManteCliProCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteCliProCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        #endregion ManteCliPro
        
        #region ManteCliProWEB
        public ActionResult ManteCliProWEB()
        {
            return View();
        }
        public string ManteCliProWEBCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteCliProWEBCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        #endregion ManteCliProWEB
        
        #region ManteTabCam
        public ActionResult ManteTabCam()
        {
            return View();
        }
        public string ManteTabCamCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTabCamCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteTabCamGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTabCamCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }

        #endregion ManteTabCam

        #region ManteTabCamP
        public ActionResult ManteTabCamP()
        {
            return View();
        }
        public string ManteTabCamPCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTabCamPCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteTabCamPGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTabCamPCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }

        #endregion ManteTabCamP

        #region ManteServicio
        public ActionResult ManteServicio()
        {
            return View();
        }
        public string ManteServicioCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteServicioGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }

        #endregion ManteServicio

        #region ManteServicioGrupos
        public ActionResult ManteServicioGrupos()
        {
            return View();
        }
        public string ManteServicioGruposCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioGruposCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteServicioGruposGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteServicioGruposCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        #endregion ManteServicioGrupos

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

        #region ManteModulosPerfiles
        public ActionResult ManteModulosPerfiles()
        {
            return View();
        }
        public string ManteModulosPerfilesCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteModulosPerfilesCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteModulosPerfilesGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteModulosPerfilesCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        #endregion ManteModulosPerfiles

    }
}
