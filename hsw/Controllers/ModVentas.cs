using General.Librerias.AccesoDatos.MySQL;
using Microsoft.AspNetCore.Mvc;

namespace hsw.Controllers
{
#pragma warning disable CS8600
#pragma warning disable CS8602
#pragma warning disable CS8603
#pragma warning disable CS8604
    public class ModVentas : Controller
    {
        public IActionResult GRRConsulta()
        {
            return View();
        }
        public IActionResult GRRemitente()
        {
            return View();
        }
        public string ManteGR_CSV(string Data)
        {
            string id_cia = "1"; //HttpContext.Session.GetString("id_cia");
            string id_usr = "1"; //HttpContext.Session.GetString("id_cia");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteGR_CSV", "pdata", id_cia + "|" + id_usr + "|" + Data + "|");
            return rpta;
        }

    }
}
