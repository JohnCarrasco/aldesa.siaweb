using General.Librerias.AccesoDatos.MySQL;
using Microsoft.AspNetCore.Mvc;

namespace hsw.Controllers
{
    public class ModRecursosHumanosController : Controller
    {
        #pragma warning disable CS8602
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;
        public ModRecursosHumanosController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            _configuration = configuration;
        }
        public ActionResult ManteColaborador()
        {
            return View();
        }
        public string ObtenerEstablecimientosCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_rol = HttpContext.Session.GetString("id_rol");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspEstablecimientosCSV", "pdata", id_cia + "|" + id_rol);
            return rpta;
        }
        public string ObtenerTrabajadoresCSV(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspTrabajadoresLstCSV", "pdata", id_cia + "|" + Data);
            return rpta;
        }


    }
}
