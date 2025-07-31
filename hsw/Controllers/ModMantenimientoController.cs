using General.Librerias.AccesoDatos.MySQL; //DaSQL
using hsw.Filters;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace hsw.Controllers
{
    [FiltroAutenticacion]
    public class ModMantenimientoController : Controller
    {
        #pragma warning disable CS8600
        #pragma warning disable CS8602
        #pragma warning disable CS8604
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;
        public ModMantenimientoController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            _configuration = configuration;
        }

        #region ManteIngresos
        public ActionResult ManteIngresos()
        {
            return View();
        }
        public string ManteIngresosCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteIngresosCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteIngresosGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteIngresosCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        public string ManteIngresosPdf(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia").PadLeft(3, '0');
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = ""; // oDaSQL.EjecutarComando("uspIngresoPdfCSV", "pdata", id_cia + "|" + Data);

            //string rutaEscritorio = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            string rutaCompletaPdf = Path.Combine(_env.ContentRootPath,"Documentos/Ordenes", "prueba.pdf");

            using (var writer = new PdfWriter(rutaCompletaPdf))
            {
                using (var pdf = new PdfDocument(writer))
                {
                    var document = new Document(pdf);
                    PdfFont negritaFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                    document.Add(new Paragraph("¡Hola, Mundo con iText 8!")
                        .SetFont(negritaFont)
                        .SetFontSize(24)
                        .SetTextAlignment(TextAlignment.CENTER));

                    document.Add(new Paragraph("Este es un ejemplo básico de cómo generar un documento PDF " +
                                               "utilizando la librería iText 8 en C#. " +
                                               "La API es más moderna y modular que iTextSharp.")
                        .SetFontSize(12)
                        .SetMarginTop(20));

                    document.Add(new List()
                        .Add(new ListItem("Elemento 1 de la lista"))
                        .Add(new ListItem("Elemento 2 de la lista"))
                        .Add(new ListItem("Elemento 3 de la lista")));
                    document.Close();
                }
            }

            //using (var memoryStream = new MemoryStream())
            //{
            //    using (var writer = new PdfWriter(memoryStream))
            //    {
            //        using (var pdf = new PdfDocument(writer))
            //        {
            //            var document = new Document(pdf);
            //            PdfFont negritaFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
            //            document.Add(new Paragraph("¡Hola, Mundo con iText 8!")
            //                .SetFont(negritaFont)
            //                .SetFontSize(24)
            //                .SetTextAlignment(TextAlignment.CENTER));

            //            document.Add(new Paragraph("Este es un ejemplo básico de cómo generar un documento PDF " +
            //                                       "utilizando la librería iText 8 en C#. " +
            //                                       "La API es más moderna y modular que iTextSharp.")
            //                .SetFontSize(12)
            //                .SetMarginTop(20));

            //            document.Add(new List()
            //                .Add(new ListItem("Elemento 1 de la lista"))
            //                .Add(new ListItem("Elemento 2 de la lista"))
            //                .Add(new ListItem("Elemento 3 de la lista")));

            //            document.Close();
            //        }
            //        writer.Close();
            //    }
            //    rpta=Convert.ToBase64String(memoryStream.ToArray());
            //}
            return rpta;
        }


        //class HeaderFooter : PdfPageEventHelper
        //{
        //    string PathImage = null;
        //    string NroGuia = null;
        //    string NroTar = null;
        //    public HeaderFooter(string LogoPath, string Guia, string Tarjeta)
        //    {
        //        PathImage = LogoPath;
        //        NroGuia = Guia;
        //        NroTar = Tarjeta;
        //    }

        //    public override void OnEndPage(PdfWriter writer, Document document)
        //    {
        //        //base.OnEndPage(writer, document);
        //        int border = 0;
        //        BaseFont bfTimes = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.EMBEDDED);
        //        Font normal8 = new Font(bfTimes, 8, Font.NORMAL, BaseColor.Black);
        //        Font normal10 = new Font(bfTimes, 10, Font.NORMAL, BaseColor.Black);

        //        // Begin image
        //        Image ProformaLogo = Image.GetInstance(PathImage);
        //        ProformaLogo.SetAbsolutePosition(document.LeftMargin, writer.PageSize.GetTop(document.TopMargin) - 30);
        //        //ProformaLogo.Alignment = Image.UNDERLYING;
        //        ProformaLogo.ScalePercent(15f);
        //        ProformaLogo.BorderWidth = border;
        //        ProformaLogo.Border = border;
        //        document.Add(ProformaLogo);
        //        // End image

        //        PdfPTable tbHeader = new PdfPTable(3);
        //        tbHeader.SetWidths(new float[] { 20f, 20f, 20f });
        //        tbHeader.DefaultCell.Border = border;

        //        tbHeader.TotalWidth = document.PageSize.Width - document.LeftMargin - document.RightMargin;
        //        tbHeader.WidthPercentage = 100f;

        //        PdfPCell _cell = new PdfPCell();

        //        _cell = new PdfPCell(new Paragraph("AV. DOS DE MAYO N° 647 CALLAO", normal8));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);
        //        tbHeader.AddCell("");
        //        tbHeader.AddCell("");

        //        _cell = new PdfPCell(new Paragraph("PROV. CONST. DEL CALLAO", normal8));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);
        //        tbHeader.AddCell("");
        //        tbHeader.AddCell("");

        //        _cell = new PdfPCell(new Paragraph("TELEFONO : 4652772 / 4297641", normal8));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);
        //        tbHeader.AddCell("");
        //        _cell = new PdfPCell(new Paragraph("AI Nro. " + NroGuia, normal10));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_RIGHT;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);

        //        _cell = new PdfPCell(new Paragraph("E-MAIL : atencionalcliente@aldesa.com.pe", normal8));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);
        //        tbHeader.AddCell("");
        //        _cell = new PdfPCell(new Paragraph("Nro. de Orden " + NroTar, normal10));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_RIGHT;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);

        //        _cell = new PdfPCell(new Paragraph("www.aldesa.com.pe", normal8));
        //        _cell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
        //        _cell.Border = border;
        //        tbHeader.AddCell(_cell);
        //        tbHeader.AddCell("");
        //        tbHeader.AddCell("");

        //        //tbHeader.AddCell(new Paragraph());
        //        //_cell = new PdfPCell(new Paragraph("PROFORMA"));
        //        //_cell.HorizontalAlignment = Element.ALIGN_CENTER;
        //        //tbHeader.AddCell(_cell);

        //        tbHeader.WriteSelectedRows(0, -1, document.LeftMargin, writer.PageSize.GetTop(document.TopMargin) - 30, writer.DirectContent);

        //        /*
        //                        PdfPTable tbFooter = new PdfPTable(3);
        //                        tbFooter.TotalWidth = document.PageSize.Width - document.LeftMargin - document.RightMargin;
        //                        tbFooter.DefaultCell.Border = 0;

        //                        tbFooter.AddCell(new Paragraph());
        //                        _cell = new PdfPCell(new Paragraph("Vendemos de lo mejor"));
        //                        _cell.HorizontalAlignment = Element.ALIGN_CENTER;
        //                        tbFooter.AddCell(_cell);
        //                        _cell = new PdfPCell(new Paragraph("Página" + writer.PageNumber));
        //                        _cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        //                        tbFooter.AddCell(_cell);
        //                        tbFooter.WriteSelectedRows(0, -1, document.LeftMargin, writer.PageSize.GetBottom(document.BottomMargin), writer.DirectContent);
        //        */


        //    }
        //}





        #endregion ManteIngresos
    }
}