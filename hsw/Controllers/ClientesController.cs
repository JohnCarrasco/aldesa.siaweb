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
    public class ClientesController : Controller
        {
#pragma warning disable CS8600
#pragma warning disable CS8602
#pragma warning disable CS8604

        private readonly IWebHostEnvironment _env;
        #region Region Clientes
        public ClientesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public ActionResult Clientes()
        {
            return View();
        }
        public string ValidarLoginWeb(string Data)
        {
            //string token = Request.Headers["token"];
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].ToString();

            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuarioValidarLoginWebCsv", "pdata", Data + "|" + ipAddress + "|" + userAgent);
            if (string.IsNullOrEmpty(rpta))
            {
                rpta = "Login es invalido";
            }
            else
            {
                string[] usuario = rpta.Split("|");
                HttpContext.Session.SetString("nrodoc", usuario[0]);
                HttpContext.Session.SetString("razsoc", usuario[1]);
                HttpContext.Session.SetString("direcc", usuario[2]);
                HttpContext.Session.SetString("ip", usuario[3]);
                HttpContext.Session.SetString("appversion", usuario[4]);
            }
            return rpta;
        }
        #endregion Clientes

        //[FiltroAutenticacion]
        public ActionResult Ordenes()
        {
            string razsoc = HttpContext.Session.GetString("razsoc");
            string nrodoc = HttpContext.Session.GetString("nrodoc");
            string direcc = HttpContext.Session.GetString("direcc");
            ViewBag.RazSoc = razsoc;
            ViewBag.NroDoc = nrodoc;
            ViewBag.Direcc = direcc;
            return View();
        }
        public string OrdenesCSV(string Data)
        {
            string nrodoc = HttpContext.Session.GetString("nrodoc");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspConsultaOrdenesCSV", "pdata",  Data + "|" + nrodoc);
            return rpta;
        }
    }
}