using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using General.Librerias.AccesoDatos.MySQL; //DaSQL
using Microsoft.Extensions.Logging;
using hsw.Filters;
using System.IO;
using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.SignalR;
//using hsw.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Net.Http.Headers;
//using DocumentFormat.OpenXml.Bibliography;

namespace hsw.Controllers
{
    public class HSWController : Controller
        {
#pragma warning disable CS8600
#pragma warning disable CS8602
#pragma warning disable CS8604
        /*
                private IHubContext<ChatHub> _hubContext;

                private readonly IWebHostEnvironment _env;
                public HSWController(IWebHostEnvironment env,IHubContext<ChatHub> hubContext)
                {
                    _env = env;
                    _hubContext = hubContext;
                }
        */

        private readonly IWebHostEnvironment _env;
        public HSWController(IWebHostEnvironment env)
        {
            _env = env;
        }

        #region Region Login
        public ActionResult Login()
        {
            ViewBag.Token = Guid.NewGuid().ToString();
            return View();
        }
        public string ValidarLogin(string Data)
        {
            //string token = Request.Headers["token"];
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();

            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuarioValidarLoginCsv", "pdata", Data + "|" + ipAddress + "|" + userAgent);
            if (string.IsNullOrEmpty(rpta))
            {
                rpta = "Login es invalido";
            }
            else
            {
                string[] usuario = rpta.Split("|");
                HttpContext.Session.SetString("id_cia", usuario[0]);
                HttpContext.Session.SetString("empresa", usuario[1]);
                HttpContext.Session.SetString("id_usr", usuario[2]);
                HttpContext.Session.SetString("usuario", usuario[3]);
                HttpContext.Session.SetString("nombres", usuario[4]);
                HttpContext.Session.SetString("id_rol", usuario[5]);
                HttpContext.Session.SetString("rol", usuario[6]);
                HttpContext.Session.SetString("sexo", usuario[7]);
                HttpContext.Session.SetString("ip", usuario[8]);
                HttpContext.Session.SetString("appversion", usuario[9]);
                HttpContext.Session.SetString("ruc", usuario[10]);
            }
            return rpta;
        }
        #endregion Login

        [FiltroAutenticacion]
        public ActionResult Inicio()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string Nombres = HttpContext.Session.GetString("nombres");
            string Rol = HttpContext.Session.GetString("rol");
            string Sexo = HttpContext.Session.GetString("sexo");
            ViewBag.id_cia = id_cia;
            ViewBag.Nombres = Nombres;
            ViewBag.Rol = Rol;
            if (Sexo == "M")
            {
                ViewBag.ProfileImageUrlA = "../../img/avatars/5.png";
                ViewBag.ProfileImageUrlB = "../../img/avatars/5.png";
            }
            else
            {
                ViewBag.ProfileImageUrlA = "../../img/avatars/8.png";
                ViewBag.ProfileImageUrlB = "../../img/avatars/8.png";
            }
            return View();
        }
        public string obtenerContadorEmpresas(string Data)
        {
            HttpContext.Session.SetString("id_cia", Data);
            string id_cia = HttpContext.Session.GetString("id_cia");
            if (Data != "0") id_cia = Data;
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspObtenerContadorEmpresasCSV", "pdata", id_cia);
            return rpta;
        }
        #region DBDefault
        public ActionResult DBDefault()
        {
            return View();
        }

        public string Default(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspDefaultCSV", "pdata", id_cia);
            return rpta;
        }
        #endregion DBDefault

        public ActionResult Tablero()
        {
            return View();
        }
        public string TableroCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspTableroCSV", "pdata", id_cia + "|" + id_usr);
            return rpta;
        }


        public ActionResult DashBoard()
        {
            return View();
        }
        public ActionResult DashBoard1()
        {
            return View();
        }
        public ActionResult DatosUsuario()
        {
            return View();
        }
        public ActionResult PaginaError()
        {
            return View();
        }

        [FiltroAutenticacion]
        public string DatosUsuarioCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspDatosUsuarioCSV", "pdata", id_cia + "|" + id_usr);
            var sexo =rpta.Split("|");
            string fileNameWitPath;
            if (sexo[7].Substring(0, 1)=="M")
            {
                fileNameWitPath=Path.Combine(_env.ContentRootPath, "Images", "man.jpg");
            }
            else
            {
                fileNameWitPath=Path.Combine(_env.ContentRootPath, "Images", "women.jpg");
            }
            byte[] archivo = System.IO.File.ReadAllBytes(fileNameWitPath);
            string imgStr = Convert.ToBase64String(archivo);
            return rpta + "¯" + imgStr;
        }
        public string ObtenerLogoCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia").PadLeft(3,'0');
            string fileNameWitPath = Path.Combine(_env.ContentRootPath, "Images", id_cia + ".jpg");
            byte[] archivo = System.IO.File.ReadAllBytes(fileNameWitPath);
            string imgStr = Convert.ToBase64String(archivo);
            return imgStr;
        }
        [FiltroAutenticacion]
        public string DatosFamiliarGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspTrabajadoresFamGrbCSV", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        public string ListarMenus()
        {
            string rpta;
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            rpta = oDaSQL.EjecutarComando("uspMenuListarPorIdApCSV", "@pAplicacionID", "1");
            return rpta;
        }
        public string ObtenerDatosUsuarioMGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new StreamReader(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspDatosUsuarioMGrbCSV", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        public string ObtenerDatosAccesoCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_rol = HttpContext.Session.GetString("id_rol");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspDatosAccesoCSV", "pdata", id_cia + "|" + id_rol);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ListaPDFs()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspListaPDF", "pdata", id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ReglamentoPDFVer(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia").PadLeft(2, '0');
            string fileNameWitPath = Path.Combine(_env.ContentRootPath, "di/", id_cia + Data + ".pdf");
            string rpta = "";
            if (System.IO.File.Exists(fileNameWitPath))
            {
                byte[] archivo = System.IO.File.ReadAllBytes(fileNameWitPath);
                rpta = Convert.ToBase64String(archivo);
            }
            return rpta;
        }
        [FiltroAutenticacion]
        public string ListaPDFGrb()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspListaPDFGrb", "pdata", id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ListaPDFGrbVistas(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia").PadLeft(2, '0');
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspListaPDFGrbVistas", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public string HSW_MenuGenerarCSV(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspHSW_MenuGenerarCSV", "pdata", id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string HSW_MenuGenerarCSV2(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspHSW_MenuGenerarCSV_v2", "pdata", id_cia + "|" + id_usr + "|");
            return rpta;
        }
        public string ObtenerFecha(string Data)
        {
            //string Fecha = DateTime.Now.ToString("yyyy-MM-dd");
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspTrabajadoresCatFechaCSV", "pdata", id_cia + "|" + Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public string MostrarEva_Programada(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspEva_ProgramadaCSV", "pdata", id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string VolverReiniciarChronometro()
        {
            return "";
        }
    }
}