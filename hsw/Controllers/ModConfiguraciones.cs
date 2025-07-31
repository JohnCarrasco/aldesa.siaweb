using System.Net.Mail;
using ClosedXML.Excel;
using General.Librerias.AccesoDatos.MySQL;
using hsw.Filters;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace hsw.Controllers
{
#pragma warning disable CS8600
#pragma warning disable CS8602
#pragma warning disable CS8603
#pragma warning disable CS8604
    public class ModConfiguraciones : Controller
    {
        private readonly IWebHostEnvironment env;
        public ModConfiguraciones(IWebHostEnvironment _env)
        {
            env = _env;
        }
        public IActionResult ManteEmpresas()
        {
            return View();
        }
        public string ManteEmpresasCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteEmpresasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data + "|");
            return rpta;
        }
        public string ManteEmpresasGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteEmpresasCSV", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        public ActionResult ManteUsuarios()
        {
            return View();
        }
        public string ManteUsuariosCSV(string Data)
        {
            string id_cia = "1"; //HttpContext.Session.GetString("id_cia");
            string id_usr = "1"; //HttpContext.Session.GetString("id_cia");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteUsuariosCSV", "pdata", id_cia + "|" + id_usr +"|" + Data);
            return rpta;
        }

        public IActionResult ManteCliPro()
        {
            return View();
        }
        public string ManteCliProCSV(string Data)
        {
            string id_cia = "1"; //HttpContext.Session.GetString("id_cia");
            string id_usr = "1"; //HttpContext.Session.GetString("id_cia");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteCliProCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string CliProAdiModCSV(string Data)
        {
            string id_cia = "1"; //HttpContext.Session.GetString("id_cia");
            string id_usr = "1"; //HttpContext.Session.GetString("id_cia");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspCliProAdiModCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }

        [Obsolete]
        public async Task<string> SIRE()
        {
            #region generar token
            string rpta = "";
            string client_id = "acb9c3b8-ea9f-40f3-9452-b81b8317b632";
            string url = "https://api-seguridad.sunat.gob.pe/v1/clientessol/" + client_id + "/oauth2/token/";
            string client_secret = "I4f84OQpqzAWfQcrnGUNEw==";
            string username = "20600989147TOURICSI";
            string password = "scisteank";

            //var options = new RestClientOptions("");
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
            var client = new RestClient(options);
            var request = new RestRequest(url, RestSharp.Method.Post);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            //request.AddHeader("Cookie", "TS019e7fc2=014dc399cbbad614e9cc69077fc354942c1ee68f36a170cf16f052ce359c49bb5195732dae19d31a1c20daf67329ab13c8c6c67acc");
            request.AddParameter("grant_type", "password");
            request.AddParameter("scope", "https://api-sire.sunat.gob.pe");
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
            request.AddParameter("username", username);
            request.AddParameter("password", password);
            RestResponse response = await client.ExecuteAsync(request);
            rpta = response.Content;

            dynamic jsonObj;
            var token = "";

            jsonObj = JsonConvert.DeserializeObject(response.Content);
            token = jsonObj.access_token;
            #endregion generar token


            #region obtener periodos asignados
            string urlper = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/padron/web/omisos/080000/periodos";

            var optionsper = new RestClientOptions(urlper)
            {
                MaxTimeout = -1,
            };
            var clientper = new RestClient(optionsper);

            var requestper = new RestRequest(urlper, RestSharp.Method.Get);
            requestper.AddHeader("Authorization", "Bearer " + token);
            requestper.AddHeader("Accept", "application/json");
            requestper.AddHeader("Content-Type", "application/json");
            RestResponse responseper = await clientper.ExecuteAsync(requestper);
            rpta = responseper.Content;

            dynamic jsonObjper;

            jsonObjper = JsonConvert.DeserializeObject(responseper.Content);
            //periodos = jsonObjper.numTicket;
            #endregion obtener periodos asignados


            #region solicitar ticket propuesta
            string urlt = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rce/propuesta/web/propuesta/202406/exportacioncomprobantepropuesta?codTipoArchivo=0&codOrigenEnvio=1";

            var optionst = new RestClientOptions(urlt)
            {
                MaxTimeout = -1,
            };
            var clientt = new RestClient(optionst);

            var requestt = new RestRequest(urlt, RestSharp.Method.Get);
            requestt.AddHeader("Authorization", "Bearer " + token);
            requestt.AddHeader("Accept", "application/json");
            requestt.AddHeader("Content-Type", "application/json");
//            RestResponse responset = await clientt.ExecuteAsync(requestt);
//            dynamic jsonObjt;
//            var ticket = "";
//            jsonObjt = JsonConvert.DeserializeObject(responset.Content);
//            ticket = jsonObjt.numTicket;
            #endregion solicitar ticket propuesta


            #region consultar estado ticket
          //string urlest = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/consultaestadotickets?perIni=202406&perFin=202406&page=1&perPage=20&numTicket=";
            string urlest = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/consultaestadotickets?perIni=202406&perFin=202406&page=1&perPage=20&numTicket=20240300000009";

            var optionsest = new RestClientOptions(urlt)
            {
                MaxTimeout = -1,
            };
            var clientest = new RestClient(optionst);

            var requestest = new RestRequest(urlest, RestSharp.Method.Get);
            requestest.AddHeader("Authorization", "Bearer " + token);
            requestest.AddHeader("Accept", "application/json");
            requestest.AddHeader("Content-Type", "application/json");
            RestResponse responseest = await clientt.ExecuteAsync(requestest);
            rpta = responseest.Content;

            dynamic jsonObjest;
            string codProceso="";
            string codEstadoProceso = "";
            string codTipoAchivoReporte = "";
            string nomArchivoReporte = "";
            string nomArchivoContenido = "";


            jsonObjest = JsonConvert.DeserializeObject(responseest.Content);

            codProceso = jsonObjest.registros[0].codProceso;
            codEstadoProceso = jsonObjest.registros[0].codEstadoProceso;
            if (codProceso=="10" && codEstadoProceso=="06")
            {
                codTipoAchivoReporte = jsonObjest.registros[0].archivoReporte[0].codTipoAchivoReporte;
                nomArchivoReporte = jsonObjest.registros[0].archivoReporte[0].nomArchivoReporte;
                nomArchivoContenido = jsonObjest.registros[0].archivoReporte[0].nomArchivoContenido;

                string urldes = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/archivoreporte?nomArchivoReporte=" + nomArchivoReporte + "&codTipoArchivoReporte=" + codTipoAchivoReporte;
                var optionsdes = new RestClientOptions(urldes)
                {
                    MaxTimeout = -1,
                };
                var clientesdes = new RestClient(optionsdes);
                string fileNameWitPath = Path.Combine(env.ContentRootPath, "Documentos/SIRE/Compras", nomArchivoReporte);

                var requestdes = new RestRequest(urldes, RestSharp.Method.Get);
                requestdes.AddHeader("Authorization", "Bearer " + token);
                requestdes.AddHeader("Accept", "application/json");
                requestdes.AddHeader("Content-Type", "application/json");
                RestResponse responsedes = await clientesdes.ExecuteAsync(requestdes);

                using (FileStream fs = new(fileNameWitPath, FileMode.Create))
                {
                    using BinaryWriter bw = new(fs);
                    byte[] data = responsedes.RawBytes;
                    bw.Write(data);
                    bw.Close();
                }




                rpta = responsedes.Content;



            }


            #endregion consultar estado ticket


            return rpta;
        }













        [FiltroAutenticacion]
        public ActionResult ManteEmpresa()
        {
            return View();
        }
        [FiltroAutenticacion]
        public ActionResult ManteRoles()
        {
            return View();
        }
        [FiltroAutenticacion]
        public string PerfilesLst()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspHSW_PerfilesLstCSV", "pdata", id_cia);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ModulosLst()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspHSW_ModulosLstCSV", "pdata", id_cia);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ModulosGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new StreamReader(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspHSW_ModulosGrbCSV", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ModulosALst()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspHSW_ModulosALstCSV", "pdata", id_cia);
            return rpta;
        }
        [FiltroAutenticacion]
        public string PerfilModuloCSV(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspHSW_PerfilModuloCSV", "pdata", id_cia + '|' + Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public string PerfilModuloGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("uspHSW_PerfilModuloGrbCSV", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        //[FiltroAutenticacion]
        //public ActionResult ManteUsuarios()
        //{
        //    ViewBag.Empresa = HttpContext.Session.GetString("empresa");
        //    ViewBag.ApiKey = "6m97sBNVIMc2rH8Q5ShyqtP4evm653lnT2w0zm39Mp5t0Ixn5PvVBVpmj4F7Vx4L";
        //    return View();
        //}
        [FiltroAutenticacion]
        public ActionResult ManteClave()
        {
            return View();
        }

        [FiltroAutenticacion]
        public string ObtenerConfiguracionClave()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspObtenerConfiguracionClaveCSV", "pdata", id_cia);
            return rpta;
        }

        [FiltroAutenticacion]
        public string ConfiguracionClaveGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            StreamReader sr = new(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspConfiguracionClaveGrbCSV", "pdata", id_cia + "|" + data.Result);
            return rpta;
        }

        [FiltroAutenticacion]
        public string ObtenerRoles()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspEstablecimientosUsuarioCSV", "pdata", id_cia);
            return rpta;
        }

        [FiltroAutenticacion]
        public string ObtenerEstablecimientosUsuario()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspEstablecimientosUsuarioCSV", "pdata", id_cia);
            return rpta;
        }

        [FiltroAutenticacion]
        public string ObtenerUsuariosLstCSV(string CodEst)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuariosLstCSV", "pdata", id_cia + "|" + CodEst);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ObtenerUsuarioGetCSV(string CodUsr)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuarioGetCSV", "pdata", id_cia + "|" + CodUsr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ObtenerUsuarioGrbCSV()
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuarioGrbCSV", "pdata", data.Result + "|" + id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ObtenerUsuarioEliCSV(string CodUsr)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspUsuarioEliCSV", "pdata", CodUsr + "|" + id_cia + "|" + id_usr);
            return rpta;
        }
        [FiltroAutenticacion]
        public IActionResult ObtenerUsuariosXLS(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;

            string rpta = oDaSQL.EjecutarComando("uspUsuariosXLS", "pdata", id_cia + "|" + Data);

            string[] titulo = Data.Split("|");
            string[] detalle = rpta.Split("¬");

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Medico Ocupacional");
                worksheet.Cell(1, 1).Value = "INFORME DE USUARIOS";
                worksheet.Range("A1:N1").Merge().Style
                         .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                         .Font.SetFontSize(12);

//                worksheet.Cell(2, 1).Value = "DEL" + titulo[0] + " AL " + titulo[1];
                worksheet.Range("A2:N2").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                int col = 1;
                int li = 2;
                var Fila = 3;
                string[] cabezera = detalle[0].Split("|");
                string[] anchos = detalle[1].Split("|");
                while (col < cabezera.Length + 1)
                {
                    worksheet.Cell(Fila, col).Value = cabezera[col - 1];
                    worksheet.Cell(Fila, col).Style
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Alignment.SetWrapText()
                        .Font.SetBold(true)
                        .Font.SetFontColor(XLColor.White)
                        .Fill.SetBackgroundColor(XLColor.GreenPigment);
                    worksheet.Column(col).Width = double.Parse(anchos[col - 1]);
                    col++;
                }
                Fila++;
                while (li < detalle.Length)
                {
                    col = 1;
                    string[] campos = detalle[li].Split("|");
                    worksheet.Cell(Fila, col++).Value = li - 1;
                    while (col < campos.Length + 2)
                    {
                        worksheet.Cell(Fila, col).Value = campos[col - 2];
                        col++;
                    }
                    Fila++;
                    li++;
                }
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Usuarios.xlsx");
                }
            }
        }
        [FiltroAutenticacion]
        public string CambiarClave(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspCambiarClaveCSV", "pdata", id_cia+ "|" + id_usr + "|" + Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public ActionResult GeneradorReportes()
        {
            return View();
        }
        [FiltroAutenticacion]
        public string ReporteadorCSV(string Data)
        {
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspReporteadorCSV", "pdata", Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public string ReporteadorDetCSV(string Data)
        {
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspReporteadorDetCSV", "pdata", Data);
            return rpta;
        }
        [FiltroAutenticacion]
        public IActionResult ReporteadorXLS(string Data)
        {
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspReporteadorXLS", "pdata", Data);

            string[] titulo = Data.Split("|");
            string[] detalle = rpta.Split("¬");

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Trabajadores");
                worksheet.Cell(1, 1).Value = "REPORTE";
                worksheet.Range("A1:AL1").Merge().Style
                         .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                         .Font.SetFontSize(12);

                //                worksheet.Cell(2, 1).Value = "DEL" + titulo[0] + " AL " + titulo[1];
                worksheet.Range("A2:AL2").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                int col = 1;
                int li = 2;
                var Fila = 3;
                string[] cabezera = detalle[0].Split("|");
                string[] anchos = detalle[1].Split("|");
                while (col < cabezera.Length + 1)
                {
                    worksheet.Cell(Fila, col).Value = cabezera[col - 1];
                    worksheet.Cell(Fila, col).Style
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Alignment.SetWrapText()
                        .Font.SetBold(true)
                        .Font.SetFontColor(XLColor.White)
                        .Fill.SetBackgroundColor(XLColor.GreenPigment);
                    worksheet.Column(col).Width = double.Parse(anchos[col - 1]);
                    col++;
                }
                Fila++;
                while (li < detalle.Length)
                {
                    col = 1;
                    string[] campos = detalle[li].Split("|");
                    worksheet.Cell(Fila, col++).Value = li - 1;
                    while (col < campos.Length + 2)
                    {
                        worksheet.Cell(Fila, col).Value = campos[col - 2];
                        col++;
                    }
                    Fila++;
                    li++;

                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Tabla.xlsx");
                }
            }
        }

        [FiltroAutenticacion]
        public ActionResult ChatHSW()
        {
            return View();
        }
        [FiltroAutenticacion]
        public string obtenerUsuario()
        {
            string? Usuario = HttpContext.Session.GetString("usuario");
            return Usuario;
        }

        #region StoreHub RPA
        [FiltroAutenticacion]
        public ActionResult Storehub()
        {
            return View();
        }
        [FiltroAutenticacion]
        public string ObtenerStoreHub(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("GG_RPA_Storehub", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;

        }
        [FiltroAutenticacion]
        public string GuardarStoreHub(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new StreamReader(Request.Body);
            var data = sr.ReadToEndAsync();
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("GG_RPA_Storehub", "pdata", id_cia + "|" + id_usr + "|" + data.Result);
            return rpta;
        }
        [FiltroAutenticacion]
        public string EnviarCorreo(string Data)
        {
            string? id_cia = HttpContext.Session.GetString("id_cia");
            string? id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL? oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string? rpta = oDaSQL.EjecutarComando("GG_RPA_Storehub", "pdata", id_cia + "|" + id_usr + "|" + Data);
            //Primero obtenemos los correos
            string[] dato_array = rpta.Split("¯");
            string EmailDestino = dato_array[0];
            string correoCC = dato_array[1];
            string AsuntoCC = dato_array[2];
            string CuerpoResumen = dato_array[3];
            string CuerpoDetalle = dato_array[4];
            string respuesta;
            //Valido si tiene incidencias
            if (AsuntoCC == "")
            {
                respuesta = "No tiene incidencias";
            }
            else
            {
                string[] DetalleTicket = CuerpoDetalle.Split("¬");
                //Esto no se debe cambiar
                string EmailOrigen = "canco@sic.com.pe";
                string Contraseña = "Robot2663-";

                string TablaDetalle = "<table class'display nowrap table-bordered w-100 shadow rounded no-footer dataTable' style='text-align: center;'>";
                TablaDetalle += "<thead style='background-color: #2ca8dd ;color: #ffffff; font-weight: bold;text-align: center;'>";
                TablaDetalle += "<tr><td>N</td><td>HALLAZGO</td><td>ESTADO</td><td>OBS</td></tr>";
                TablaDetalle += "</thead>";
                for (int i = 0; i < DetalleTicket.Length; i++)
                {
                    string[] campos = DetalleTicket[i].Split("|");
                    TablaDetalle += "<tr><td>" + campos[0] + "</td><td>" + campos[1] + "</td><td>" + campos[2] + "</td><td>" + campos[3] + "</td></tr>";
                }
                TablaDetalle += "</table>";
                TablaDetalle += "<br><br><b>Nota:</b> Para más detalles, por favor consulte con su superior inmediato.<br>";
                TablaDetalle += "**No responder a este correo.";

                string CuerpoHTML = CuerpoResumen + TablaDetalle;

                MailMessage oMailMessage = new(EmailOrigen, EmailDestino, AsuntoCC, CuerpoHTML);
                //Agregar copias
                oMailMessage.CC.Add(correoCC);

                oMailMessage.IsBodyHtml = true;

                SmtpClient oSmtpClient = new("smtp.office365.com")
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = "smtp.office365.com",
                    Port = 587,
                    Credentials = new System.Net.NetworkCredential(EmailOrigen, Contraseña)
                };
                oSmtpClient.Send(oMailMessage);
                oMailMessage.Dispose();
                oSmtpClient.Dispose();
                respuesta = "correo enviado";
            }

            return respuesta;
        }

        #endregion StoreHub RPA

    }
}
