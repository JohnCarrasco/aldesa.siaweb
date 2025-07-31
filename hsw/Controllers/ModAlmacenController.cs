using General.Librerias.AccesoDatos.MySQL; //DaSQL
using hsw.Filters;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

namespace hsw.Controllers
{
    [FiltroAutenticacion]
    public class ModAlmacenController : Controller
    {
        #pragma warning disable CS8600
        #pragma warning disable CS8602
        #pragma warning disable CS8604
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;
        public ModAlmacenController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            _configuration = configuration;
        }

        #region ManteTarjeta
        public ActionResult ManteTarjetas()
        {
            return View();
        }
        public string ManteTarjetasCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTarjetasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteTarjetasGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTarjetasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }

        public async Task<string> ManteTarjetasGrbPDF(DocumentoPDF DatosPDF)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            string CodSer = DatosPDF.CodSer;
            string NroTar = DatosPDF.NroTar;
            string TipDoc = DatosPDF.TipDoc;
            string Obs = DatosPDF.Obs;
            string fileName = DatosPDF.File.FileName;
            string fileSize = DatosPDF.File.Length.ToString();
            string data = CodSer + "|" + NroTar + "|" + TipDoc + "|" + Obs + "|" + fileName + "|" + fileSize;
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteTarjetasCSV", "pdata", id_cia + "|" + id_usr + "|grp|" + data);
            string[] listas = rpta.Split("¯");
            string fileNameZIP = listas[0];
            string fileNameWitPath = Path.Combine(_env.ContentRootPath, "Documentos/Ordenes", fileName);
            string fileNameWitPathZip = Path.Combine(_env.ContentRootPath, "Documentos/Ordenes", fileNameZIP);

            string carpeta1 = Path.Combine(_env.ContentRootPath, "Documentos");
            string carpeta2 = Path.Combine(_env.ContentRootPath, "Documentos/Ordenes");

            //if (!Directory.Exists(carpeta1))
            //{
            //    Directory.CreateDirectory(carpeta1);
            //}
            if (!Directory.Exists(carpeta2))
            {
                Directory.CreateDirectory(carpeta2);
            }

            using (FileStream fs = new(fileNameWitPath, FileMode.Create))
            {
                await DatosPDF.File.CopyToAsync(fs);
            }
            ComprimirArchivo(fileNameWitPath, fileNameWitPathZip);
            if (System.IO.File.Exists(fileNameWitPath))
            {
                System.IO.File.Delete(fileNameWitPath);
            }

            return listas[1];
        }
        public class DocumentoPDF
        {
            public string? CodSer { set; get; }
            public string? NroTar { set; get; }
            public string? TipDoc { set; get; }
            public string? Obs { set; get; }
            public IFormFile? File { set; get; }
        }
        static void ComprimirArchivo(string archivoAComprimir, string archivoZipSalida)
        {
            // Asegúrate de que el archivo de entrada exista
            if (!System.IO.File.Exists(archivoAComprimir))
            {
                //System.IO.File.Delete(archivoAComprimir);
                Console.WriteLine($"El archivo {archivoAComprimir} no existe.");
                return;
            }
            if (System.IO.File.Exists(archivoZipSalida))
            {
                System.IO.File.Delete(archivoZipSalida);
            }

            // Abre el archivo ZIP
            using (ZipArchive zip = ZipFile.Open(archivoZipSalida, ZipArchiveMode.Create))
            {
                // Agrega el archivo al archivo ZIP
                zip.CreateEntryFromFile(archivoAComprimir, Path.GetFileName(archivoAComprimir), CompressionLevel.Optimal);
            }
        }
        public string ManteTarjetasVerCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia").PadLeft(2, '0');
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string[] ruta = Data.Split("|");
            //string carpeta = Path.Combine(_env.ContentRootPath,"Documentos/Ordenes/" + id_cia + "_" + ruta[1] + "_" + ruta[2]);
            string carpeta = Path.Combine(_env.ContentRootPath, "Documentos/Ordenes");
            string filename_fisico = oDaSQL.EjecutarComando("uspManteTarjetasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            string[] archivos_nombres = filename_fisico.Split("|");
            string archivoVer = Path.Combine(carpeta, archivos_nombres[1]);
            string rpta = "";
            if (System.IO.File.Exists(archivoVer))
            {
                using (var zip = ZipFile.OpenRead(archivoVer))
                {
                    var entry = zip.GetEntry(archivos_nombres[0]);
                    if (entry != null)
                    {
                        using (var stream = entry.Open())
                        using (var memoryStream = new MemoryStream())
                        {
                            stream.CopyTo(memoryStream);
                            byte[] archivo = memoryStream.ToArray();
                            rpta = archivos_nombres[0] + "|" + Convert.ToBase64String(archivo);
                        }
                    }
                }

            }
            return rpta;
        }
        public string ManteTarjetasEliCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string fileNameZIP = oDaSQL.EjecutarComando("uspManteTarjetasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            string fileNameWitPathZip = Path.Combine(_env.ContentRootPath, "Documentos/Ordenes", fileNameZIP);
            if (System.IO.File.Exists(fileNameWitPathZip))
            {
                System.IO.File.Delete(fileNameWitPathZip);
            }
            return fileNameZIP;
        }
        #endregion
    }
}