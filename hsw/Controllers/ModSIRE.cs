using System.IO.Compression;
using System.Net.Mail;
using System.Net.Sockets;
using System.Text;
using System.Text.Json.Nodes;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Math;
using DocumentFormat.OpenXml.Office2010.Excel;
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
    public class ModSIRE : Controller
    {
        private readonly IWebHostEnvironment env;
        public ModSIRE(IWebHostEnvironment _env)
        {
            env = _env;
        }
        public IActionResult ManteSIRECompras()
        {
            return View();
        }
        public string ManteSIREComprasCSV(string Data)
        {
            string rpta = "";
            string token = "";
            string TipOpe = Data[..1];
            if (TipOpe == "1")
            {
                token = obtenerToken();
                rpta = obtenerPeriodos(token);
            }
            if (TipOpe == "2")
            {
                token = obtenerToken();
                string periodo = Data.Substring(2, 6);
                rpta = solicitarTicketPropuesta(token, periodo);
            }
            if (TipOpe == "3")
            {
                token = obtenerToken();
                string periodo = Data.Substring(2, 6);
                rpta = solicitarPropuesta(token, periodo);
            }
            if (TipOpe == "5")
            {
                string id_cia = "1";
                string id_empresa = "1";
                string id_usr = "1";
                string periodo = Data.Substring(2, 6);
                DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
                rpta = oDaSQL.EjecutarComando("uspSUNATPropuesto", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|5|" + periodo + "|");
            }
            return rpta;
        }
        public string obtenerToken()
        {
            string id_cia = "1";
            string id_empresa = "1";
            string id_usr = "1";
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspSUNATPropuesto", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|1|");
            string[] reg=rpta.Split('|');
            string client_id = reg[0];
            string client_secret = reg[1];
            string username = reg[2];
            string password = reg[3];
            string url = "https://api-seguridad.sunat.gob.pe/v1/clientessol/" + client_id + "/oauth2/token/";

#pragma warning disable CS0618 // El tipo o el miembro están obsoletos
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
#pragma warning restore CS0618 // El tipo o el miembro están obsoletos
            var client = new RestClient(options);
            var request = new RestRequest(url, RestSharp.Method.Post);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "password");
            request.AddParameter("scope", "https://api-sire.sunat.gob.pe");
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
            request.AddParameter("username", username);
            request.AddParameter("password", password);
            RestResponse response = client.Execute(request);
            dynamic jsonObj;
            jsonObj = JsonConvert.DeserializeObject(response.Content);
            var token = jsonObj.access_token;
            return token;
        }
        public string obtenerPeriodos(string token)
        {
            string id_cia = "1";
            string id_empresa = "1";
            string id_usr = "1";
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string url = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/padron/web/omisos/080000/periodos";
#pragma warning disable CS0618 // El tipo o el miembro están obsoletos
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
#pragma warning restore CS0618 // El tipo o el miembro están obsoletos
            string rpta = "";
            var client = new RestClient(options);
            var request = new RestRequest(url, RestSharp.Method.Get);
            request.AddHeader("Authorization", "Bearer " + token);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            RestResponse response = client.Execute(request);
            dynamic jsonObj;
            jsonObj = JsonConvert.DeserializeObject(response.Content);

            foreach (var Ejercicios in jsonObj)
            {
                rpta = id_cia + "|" + id_empresa + "|" + id_usr + "|1|" + Ejercicios.numEjercicio + "|" + Ejercicios.desEstado;
                oDaSQL.EjecutarComando("uspSUNATPeriodos", "pdata", rpta);

                foreach (var Periodos in Ejercicios.lisPeriodos)
                {
                    rpta = id_cia + "|" + id_empresa + "|" + id_usr + "|2|" + Periodos.perTributario + "|" + Periodos.codEstado + "|" + Periodos.desEstado;
                    oDaSQL.EjecutarComando("uspSUNATPeriodos", "pdata", rpta);
                }
            }
            rpta = oDaSQL.EjecutarComando("uspSUNATPeriodos", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|3|");
            return rpta;
        }
        public string solicitarTicketPropuesta(string token, string periodo)
        {
            string id_cia = "1";
            string id_empresa = "1";
            string id_usr = "1";
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string url = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rce/propuesta/web/propuesta/" + periodo + "/exportacioncomprobantepropuesta?codTipoArchivo=0&codOrigenEnvio=1";
#pragma warning disable CS0618 // El tipo o el miembro están obsoletos
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
#pragma warning restore CS0618 // El tipo o el miembro están obsoletos
            var client = new RestClient(options);
            var request = new RestRequest(url, RestSharp.Method.Get);
            request.AddHeader("Authorization", "Bearer " + token);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            RestResponse response = client.Execute(request);
            dynamic jsonObj;
            jsonObj = JsonConvert.DeserializeObject(response.Content);
            string ticket = jsonObj.numTicket;
            oDaSQL.EjecutarComando("uspSUNATPropuesto", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|2|" + periodo + "|" + ticket);
            return ticket;
        }
        public string solicitarPropuesta(string token,string periodo)
        {
            string id_cia = "1";
            string id_empresa = "1";
            string id_usr = "1";
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string ticket = oDaSQL.EjecutarComando("uspSUNATPropuesto", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|3|" + periodo + "|");
            string url = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/consultaestadotickets?perIni=" + periodo + "&perFin=" + periodo + "&page=1&perPage=20&numTicket=" + ticket;
#pragma warning disable CS0618 // El tipo o el miembro están obsoletos
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
#pragma warning restore CS0618 // El tipo o el miembro están obsoletos
            string rpta = "";
            var client = new RestClient(options);
            var request = new RestRequest(url, RestSharp.Method.Get);
            request.AddHeader("Authorization", "Bearer " + token);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            RestResponse response = client.Execute(request);

            dynamic jsonObj = JsonConvert.DeserializeObject(response.Content);
            string codProceso = jsonObj.registros[0].codProceso;
            string codEstadoProceso = jsonObj.registros[0].codEstadoProceso;

            if (codProceso == "10" && codEstadoProceso == "06")
            {
                string codTipoAchivoReporte = jsonObj.registros[0].archivoReporte[0].codTipoAchivoReporte;
                string nomArchivoReporte = jsonObj.registros[0].archivoReporte[0].nomArchivoReporte;
                string nomArchivoContenido = jsonObj.registros[0].archivoReporte[0].nomArchivoContenido;
                descargarPropuesta(periodo, codTipoAchivoReporte, nomArchivoReporte, nomArchivoContenido, token);
            }
            else
            {
                rpta = "no";
            }

            return rpta;
        }
        public string descargarPropuesta(string periodo, string codTipoAchivoReporte, string nomArchivoReporte, string nomArchivoContenido, string token)
        {
            string id_cia = "1";
            string id_empresa = "1";
            string id_usr = "1";
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;

            string url = "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/archivoreporte?nomArchivoReporte=" + nomArchivoReporte + "&codTipoArchivoReporte=" + codTipoAchivoReporte;
#pragma warning disable CS0618 // El tipo o el miembro están obsoletos
            var options = new RestClientOptions(url)
            {
                MaxTimeout = -1,
            };
#pragma warning restore CS0618 // El tipo o el miembro están obsoletos
            var clientes = new RestClient(options);
            string fileNameWitPathZip = Path.Combine(env.ContentRootPath, "Documentos/SIRE/Compras", nomArchivoReporte);
            string fileNameWitPathCSV = Path.Combine(env.ContentRootPath, "Documentos/SIRE/Compras", nomArchivoContenido);
            string carpetaDestino = Path.Combine(env.ContentRootPath, "Documentos/SIRE/Compras", ""); ;
            var request = new RestRequest(url, RestSharp.Method.Get);
            request.AddHeader("Authorization", "Bearer " + token);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            RestResponse response = clientes.Execute(request);
            using (FileStream fs = new(fileNameWitPathZip, FileMode.Create))
            {
                using BinaryWriter bw = new(fs);
                byte[] data = response.RawBytes;
                bw.Write(data);
                bw.Close();
            }

            if (System.IO.File.Exists(fileNameWitPathZip))
            {
                DescomprimirArchivoDeZip(fileNameWitPathZip, nomArchivoContenido, carpetaDestino);
            }

            //if (System.IO.File.Exists(fileNameWitPathZip))
            //{
            //    System.IO.File.Delete(fileNameWitPathZip);
            //}

            string linea;
            string fileNameWitPath = Path.Combine(env.ContentRootPath, "Documentos/SIRE/Compras", nomArchivoReporte);

            // Procesando tabla TXT
            try
            {
                // Leer el archivo línea por línea
                using (StreamReader sr = new StreamReader(fileNameWitPathCSV))
                {
                    linea = sr.ReadLine();
                    while ((linea = sr.ReadLine()) != null)
                    {
                        oDaSQL.EjecutarComando("uspSUNATPropuesto", "pdata", id_cia + "|" + id_empresa + "|" + id_usr + "|4|" + periodo + "|" + linea);
                        // Procesar cada línea leída
                        Console.WriteLine(linea);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Ocurrió un error al leer el archivo: {e.Message}");
            }
            return "";
        }
        static void DescomprimirArchivoDeZip(string archivoZip, string archivoADescomprimir, string carpetaDestino)
        {
            if (!System.IO.File.Exists(archivoZip))
            {
                Console.WriteLine($"El archivo ZIP {archivoZip} no existe.");
                return;
            }
            if (!Directory.Exists(carpetaDestino))
            {
                Directory.CreateDirectory(carpetaDestino);
            }
            using (ZipArchive zip = ZipFile.OpenRead(archivoZip))
            {
                ZipArchiveEntry entry = zip.GetEntry(archivoADescomprimir);

                if (entry != null)
                {
                    string entryDestination = Path.Combine(carpetaDestino, Path.GetFileName(archivoADescomprimir));
                    if (!entryDestination.StartsWith(carpetaDestino, StringComparison.OrdinalIgnoreCase))
                    {
                        throw new Exception("Intento de extracción fuera de la carpeta de destino.");
                    }
                    Directory.CreateDirectory(Path.GetDirectoryName(entryDestination));
                    entry.ExtractToFile(entryDestination, true);
                    Console.WriteLine($"Archivo {archivoADescomprimir} extraído con éxito a {entryDestination}");
                }
                else
                {
                    Console.WriteLine($"No se encontró el archivo {archivoADescomprimir} en el ZIP.");
                }
            }
        }
    }
}
