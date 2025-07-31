using ClosedXML.Excel;
using DocumentFormat.OpenXml.Wordprocessing; //DaSQL
using General.Librerias.AccesoDatos.MySQL;
using hsw.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace hsw.Controllers
{
    [FiltroAutenticacion]
    public class ModReportesController : Controller
    {
        #pragma warning disable CS8600
        #pragma warning disable CS8602

        #region RptRegistroVentas
        public ActionResult RptRegistroVentas()
        {
            return View();
        }
        public IActionResult RptRegistroVentas_XLS(string Data)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Reporte");

                string[] fechas = Data.Split("|");
                fechas[0] = fechas[0].Substring(8, 2) + "/" + fechas[0].Substring(5, 2) + "/" + fechas[0].Substring(0, 4);
                fechas[1] = fechas[1].Substring(8, 2) + "/" + fechas[1].Substring(5, 2) + "/" + fechas[1].Substring(0, 4);
                DateTime FechaReporte = DateTime.Now;
                worksheet.Column("A").Width = 5;
                worksheet.Column("B").Width = 14;
                worksheet.Column("C").Width = 9.00;
                worksheet.Column("D").Width = 10.00;
                worksheet.Column("E").Width = 12.00;
                worksheet.Column("F").Width = 50.00;
                worksheet.Column("G").Width = 60.00;
                worksheet.Column("H").Width = 6.22;
                worksheet.Column("I").Width = 6.0;
                worksheet.Columns("J:O").Width = 12.00;

                worksheet.Range("A4:O5").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A4:O5").Style.Border.OutsideBorderColor = XLColor.Black;
                worksheet.Range("A5:O5").Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A5:O5").Style.Border.InsideBorderColor = XLColor.Black;

                worksheet.Cell("A1").Value = "REPORTE DE VENTAS";
                worksheet.Range("A1:O1").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(18).Font.SetBold();
                worksheet.Cell("A2").Value = "DEL " + fechas[0] + " AL " + fechas[1];
                worksheet.Range("A2:O2").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold();

                worksheet.Cell("A4").Value = "Fecha Reporte : " + FechaReporte;
                worksheet.Cell("A4").Style.Font.SetFontSize(14).Font.SetBold();
                worksheet.Cell("J4").Value = "S O L E S";
                worksheet.Range("J4:L4").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold().Font.SetFontColor(XLColor.Black).Fill.BackgroundColor = XLColor.FromArgb(226, 135, 67);
                worksheet.Cell("M4").Value = "D Ó L A R E S";
                worksheet.Range("M4:O4").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold().Font.SetFontColor(XLColor.Black).Fill.BackgroundColor = XLColor.FromArgb(138, 214, 227, 255);
                worksheet.Range("A5:O5").Style
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Alignment.SetVertical(XLAlignmentVerticalValues.Center)
                        .Alignment.SetWrapText()
                        .Font.SetBold(true)
                        .Font.SetFontColor(XLColor.White)
                        .Fill.BackgroundColor = XLColor.FromArgb(25, 121, 169);

                worksheet.Cell("A5").Value = "T/D";
                worksheet.Cell("B5").Value = "Nro.Documento";
                worksheet.Cell("C5").Value = "Nro.Orden";
                worksheet.Cell("D5").Value = "Fecha";
                worksheet.Cell("E5").Value = "RUC/DNI";
                worksheet.Cell("F5").Value = "Razón Social/Apellidos y Nombres";
                worksheet.Cell("G5").Value = "Detalle";
                worksheet.Cell("H5").Value = "T/M";
                worksheet.Cell("I5").Value = "T/C";
                worksheet.Cell("J5").Value = "Valor Venta";
                worksheet.Cell("K5").Value = "IGV";
                worksheet.Cell("L5").Value = "Total";
                worksheet.Cell("M5").Value = "Valor Venta";
                worksheet.Cell("N5").Value = "IGV";
                worksheet.Cell("O5").Value = "Total";

                string id_cia = HttpContext.Session.GetString("id_cia");
                string id_usr = HttpContext.Session.GetString("id_usr");
                DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
                string rpta = oDaSQL.EjecutarComando("uspRptFacturacionCSV", "pdata", id_cia + "|" + id_usr + "|RVE|" + Data);
                string[] lista = rpta.Split("¬");
                int Fila = 6;
                int FilaInicio = 0;
                int FilaFin = 0;
                int li = 0;
                string[] campos = lista[0].Split("|");
                string serie = "";
                decimal totalGeneralJ = 0;
                decimal totalGeneralK = 0;
                decimal totalGeneralL = 0;
                decimal totalGeneralM = 0;
                decimal totalGeneralN = 0;
                decimal totalGeneralO = 0;
                while (li < lista.Length)
                {
                    campos = lista[li].Split("|");
                    serie = campos[0];
                    worksheet.Cell("A" + Fila).Value = "SERIE : " + serie;
                    worksheet.Range("A" + Fila + ":O" + Fila).Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(12).Font.SetBold();
                    Fila++;
                    FilaInicio = Fila;
                    while (serie == campos[0])
                    {
                        worksheet.Cell("A" + Fila).Value = campos[1];
                        worksheet.Cell("B" + Fila).Value = campos[2].Substring(0,4) + "-" + campos[2].Substring(4, 8);
                        worksheet.Cell("C" + Fila).Value = campos[3];
                        worksheet.Cell("D" + Fila).Value = campos[4];
                        worksheet.Cell("E" + Fila).Value = campos[5];
                        worksheet.Cell("F" + Fila).Value = campos[6];
                        worksheet.Cell("G" + Fila).Value = campos[7];
                        worksheet.Cell("H" + Fila).Value = campos[8];
                        worksheet.Cell("I" + Fila).Value = decimal.Parse(campos[9]);
                        worksheet.Cell("J" + Fila).Value = decimal.Parse(campos[10]);
                        worksheet.Cell("K" + Fila).Value = decimal.Parse(campos[11]);
                        worksheet.Cell("L" + Fila).Value = decimal.Parse(campos[10]) + decimal.Parse(campos[11]);
                        worksheet.Cell("M" + Fila).Value = decimal.Parse(campos[13]);
                        worksheet.Cell("N" + Fila).Value = decimal.Parse(campos[14]);
                        worksheet.Cell("O" + Fila).Value = decimal.Parse(campos[13]) + decimal.Parse(campos[14]);
                        Fila++;
                        li++;
                        if (li >= lista.Length) break;
                        campos = lista[li].Split("|");
                    }
                    FilaFin = Fila - 1;
                    worksheet.Cell("G" + Fila).Value = "TOTAL SERIE=> " + serie;
                    worksheet.Cell("J" + Fila).FormulaA1 = "=SUM(J" + FilaInicio + ":J" + FilaFin + ")";
                    worksheet.Cell("K" + Fila).FormulaA1 = "=SUM(K" + FilaInicio + ":K" + FilaFin + ")";
                    worksheet.Cell("L" + Fila).FormulaA1 = "=SUM(L" + FilaInicio + ":L" + FilaFin + ")";
                    worksheet.Cell("M" + Fila).FormulaA1 = "=SUM(M" + FilaInicio + ":M" + FilaFin + ")";
                    worksheet.Cell("N" + Fila).FormulaA1 = "=SUM(N" + FilaInicio + ":N" + FilaFin + ")";
                    worksheet.Cell("O" + Fila).FormulaA1 = "=SUM(O" + FilaInicio + ":O" + FilaFin + ")";
                    worksheet.Range("G" + Fila + ":O" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                    worksheet.Range("J" + Fila + ":O" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(217, 212, 206, 255);

                    decimal valorJ = 0;
                    worksheet.Cell("J" + Fila).TryGetValue(out valorJ);
                    totalGeneralJ += valorJ;

                    decimal valorK = 0;
                    worksheet.Cell("K" + Fila).TryGetValue(out valorK);
                    totalGeneralK += valorK;

                    decimal valorL = 0;
                    worksheet.Cell("L" + Fila).TryGetValue(out valorL);
                    totalGeneralL += valorL;

                    decimal valorM = 0;
                    worksheet.Cell("M" + Fila).TryGetValue(out valorM);
                    totalGeneralM += valorM;

                    decimal valorN = 0;
                    worksheet.Cell("N" + Fila).TryGetValue(out valorN);
                    totalGeneralN += valorN;

                    decimal valorO = 0;
                    worksheet.Cell("O" + Fila).TryGetValue(out valorO);
                    totalGeneralO += valorO;

                    Fila += 2;
                }
                worksheet.Range("D7:D" + Fila).Style.DateFormat.Format = "dd/mm/yyyy";
                worksheet.Range("I7:I" + Fila).Style.NumberFormat.Format = "0.000";
                worksheet.Range("J7:O" + Fila).Style.NumberFormat.Format = "#,##0.00;[Red](#,##0.00)";
                
                worksheet.Cell("G" + Fila).Value = "TOTAL GENERAL";
                worksheet.Range("G" + Fila + ":O" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                worksheet.Range("J" + Fila + ":O" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(36, 152, 189, 255);

                worksheet.Cell("J" + Fila).Value = totalGeneralJ;
                worksheet.Cell("K" + Fila).Value = totalGeneralK;
                worksheet.Cell("L" + Fila).Value = totalGeneralL;
                worksheet.Cell("M" + Fila).Value = totalGeneralM;
                worksheet.Cell("N" + Fila).Value = totalGeneralN;
                worksheet.Cell("O" + Fila).Value = totalGeneralO;

                string NombreXLS = "RV_" + FechaReporte.ToString("yyyyMMddHHmmss") + ".xlsx";
                worksheet.Protect(NombreXLS);

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", NombreXLS);
                }
            }
        }
        #endregion RptRegistroVentas

        #region RptKardex
        public IActionResult RptKardex_XLS(string Data)
        {
            using (var workbook = new XLWorkbook())
            {
                string id_cia = HttpContext.Session.GetString("id_cia");
                string id_usr = HttpContext.Session.GetString("id_usr");
                DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
                string rpta = oDaSQL.EjecutarComando("uspRptFacturacionCSV", "pdata", id_cia + "|" + id_usr + "|RVE|" + Data);
                string[] lista = rpta.Split("¬");

                var worksheet = workbook.Worksheets.Add("Kardex");

                string[] fechas = Data.Split("|");
                fechas[0] = fechas[0].Substring(8, 2) + "/" + fechas[0].Substring(5, 2) + "/" + fechas[0].Substring(0, 4);
                fechas[1] = fechas[1].Substring(8, 2) + "/" + fechas[1].Substring(5, 2) + "/" + fechas[1].Substring(0, 4);
                DateTime FechaReporte = DateTime.Now;
                worksheet.Column("A").Width = 5;
                worksheet.Column("B").Width = 14;
                worksheet.Column("C").Width = 9.00;
                worksheet.Column("D").Width = 10.00;
                worksheet.Column("E").Width = 12.00;
                worksheet.Column("F").Width = 50.00;
                worksheet.Column("G").Width = 60.00;
                worksheet.Column("H").Width = 6.22;
                worksheet.Column("I").Width = 6.0;
                worksheet.Columns("J:O").Width = 12.00;

                worksheet.Range("A4:O5").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A4:O5").Style.Border.OutsideBorderColor = XLColor.Black;
                worksheet.Range("A5:O5").Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A5:O5").Style.Border.InsideBorderColor = XLColor.Black;

                worksheet.Cell("A1").Value = "KARDEX DE CONTROL DE MERCANCIAS";
                worksheet.Range("A1:N1").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold();
                //worksheet.Cell("A2").Value = "DEL " + fechas[0] + " AL " + fechas[1];
                //worksheet.Range("A2:O2").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold();

                worksheet.Cell("A4").Value = "Fecha Reporte : " + FechaReporte;
                worksheet.Cell("A4").Style.Font.SetFontSize(14).Font.SetBold();
                worksheet.Cell("J4").Value = "S O L E S";
                worksheet.Range("J4:L4").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold().Font.SetFontColor(XLColor.Black).Fill.BackgroundColor = XLColor.FromArgb(226, 135, 67);
                worksheet.Cell("M4").Value = "D Ó L A R E S";
                worksheet.Range("M4:O4").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold().Font.SetFontColor(XLColor.Black).Fill.BackgroundColor = XLColor.FromArgb(138, 214, 227, 255);
                worksheet.Range("A5:O5").Style
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Alignment.SetVertical(XLAlignmentVerticalValues.Center)
                        .Alignment.SetWrapText()
                        .Font.SetBold(true)
                        .Font.SetFontColor(XLColor.White)
                        .Fill.BackgroundColor = XLColor.FromArgb(25, 121, 169);

                worksheet.Cell("A5").Value = "T/D";
                worksheet.Cell("B5").Value = "Nro.Documento";
                worksheet.Cell("C5").Value = "Nro.Orden";
                worksheet.Cell("D5").Value = "Fecha";
                worksheet.Cell("E5").Value = "RUC/DNI";
                worksheet.Cell("F5").Value = "Razón Social/Apellidos y Nombres";
                worksheet.Cell("G5").Value = "Detalle";
                worksheet.Cell("H5").Value = "T/M";
                worksheet.Cell("I5").Value = "T/C";
                worksheet.Cell("J5").Value = "Valor Venta";
                worksheet.Cell("K5").Value = "IGV";
                worksheet.Cell("L5").Value = "Total";
                worksheet.Cell("M5").Value = "Valor Venta";
                worksheet.Cell("N5").Value = "IGV";
                worksheet.Cell("O5").Value = "Total";

                int Fila = 6;
                int FilaInicio = 0;
                int FilaFin = 0;
                int li = 0;
                string[] campos = lista[0].Split("|");
                string serie = "";
                decimal totalGeneralJ = 0;
                decimal totalGeneralK = 0;
                decimal totalGeneralL = 0;
                decimal totalGeneralM = 0;
                decimal totalGeneralN = 0;
                decimal totalGeneralO = 0;
                while (li < lista.Length)
                {
                    campos = lista[li].Split("|");
                    serie = campos[0];
                    worksheet.Cell("A" + Fila).Value = "SERIE : " + serie;
                    worksheet.Range("A" + Fila + ":O" + Fila).Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(12).Font.SetBold();
                    Fila++;
                    FilaInicio = Fila;
                    while (serie == campos[0])
                    {
                        worksheet.Cell("A" + Fila).Value = campos[1];
                        worksheet.Cell("B" + Fila).Value = campos[2].Substring(0, 4) + "-" + campos[2].Substring(4, 8);
                        worksheet.Cell("C" + Fila).Value = campos[3];
                        worksheet.Cell("D" + Fila).Value = campos[4];
                        worksheet.Cell("E" + Fila).Value = campos[5];
                        worksheet.Cell("F" + Fila).Value = campos[6];
                        worksheet.Cell("G" + Fila).Value = campos[7];
                        worksheet.Cell("H" + Fila).Value = campos[8];
                        worksheet.Cell("I" + Fila).Value = decimal.Parse(campos[9]);
                        worksheet.Cell("J" + Fila).Value = decimal.Parse(campos[10]);
                        worksheet.Cell("K" + Fila).Value = decimal.Parse(campos[11]);
                        worksheet.Cell("L" + Fila).Value = decimal.Parse(campos[10]) + decimal.Parse(campos[11]);
                        worksheet.Cell("M" + Fila).Value = decimal.Parse(campos[13]);
                        worksheet.Cell("N" + Fila).Value = decimal.Parse(campos[14]);
                        worksheet.Cell("O" + Fila).Value = decimal.Parse(campos[13]) + decimal.Parse(campos[14]);
                        Fila++;
                        li++;
                        if (li >= lista.Length) break;
                        campos = lista[li].Split("|");
                    }
                    FilaFin = Fila - 1;
                    worksheet.Cell("G" + Fila).Value = "TOTAL SERIE=> " + serie;
                    worksheet.Cell("J" + Fila).FormulaA1 = "=SUM(J" + FilaInicio + ":J" + FilaFin + ")";
                    worksheet.Cell("K" + Fila).FormulaA1 = "=SUM(K" + FilaInicio + ":K" + FilaFin + ")";
                    worksheet.Cell("L" + Fila).FormulaA1 = "=SUM(L" + FilaInicio + ":L" + FilaFin + ")";
                    worksheet.Cell("M" + Fila).FormulaA1 = "=SUM(M" + FilaInicio + ":M" + FilaFin + ")";
                    worksheet.Cell("N" + Fila).FormulaA1 = "=SUM(N" + FilaInicio + ":N" + FilaFin + ")";
                    worksheet.Cell("O" + Fila).FormulaA1 = "=SUM(O" + FilaInicio + ":O" + FilaFin + ")";
                    worksheet.Range("G" + Fila + ":O" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                    worksheet.Range("J" + Fila + ":O" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(217, 212, 206, 255);

                    decimal valorJ = 0;
                    worksheet.Cell("J" + Fila).TryGetValue(out valorJ);
                    totalGeneralJ += valorJ;

                    decimal valorK = 0;
                    worksheet.Cell("K" + Fila).TryGetValue(out valorK);
                    totalGeneralK += valorK;

                    decimal valorL = 0;
                    worksheet.Cell("L" + Fila).TryGetValue(out valorL);
                    totalGeneralL += valorL;

                    decimal valorM = 0;
                    worksheet.Cell("M" + Fila).TryGetValue(out valorM);
                    totalGeneralM += valorM;

                    decimal valorN = 0;
                    worksheet.Cell("N" + Fila).TryGetValue(out valorN);
                    totalGeneralN += valorN;

                    decimal valorO = 0;
                    worksheet.Cell("O" + Fila).TryGetValue(out valorO);
                    totalGeneralO += valorO;

                    Fila += 2;
                }
                worksheet.Range("D7:D" + Fila).Style.DateFormat.Format = "dd/mm/yyyy";
                worksheet.Range("I7:I" + Fila).Style.NumberFormat.Format = "0.000";
                worksheet.Range("J7:O" + Fila).Style.NumberFormat.Format = "#,##0.00";

                worksheet.Cell("G" + Fila).Value = "TOTAL GENERAL";
                worksheet.Range("G" + Fila + ":O" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                worksheet.Range("J" + Fila + ":O" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(36, 152, 189, 255);

                worksheet.Cell("J" + Fila).Value = totalGeneralJ;
                worksheet.Cell("K" + Fila).Value = totalGeneralK;
                worksheet.Cell("L" + Fila).Value = totalGeneralL;
                worksheet.Cell("M" + Fila).Value = totalGeneralM;
                worksheet.Cell("N" + Fila).Value = totalGeneralN;
                worksheet.Cell("O" + Fila).Value = totalGeneralO;

                string NombreXLS = "RV_" + FechaReporte.ToString("yyyyMMddHHmmss") + ".xlsx";
                worksheet.Protect(NombreXLS);

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", NombreXLS);
                }
            }
        }

        #endregion RptKardex

        #region RptInterno
        public ActionResult RptInterno()
        {
            return View();
        }
        public IActionResult RptInterno_XLS(string Data)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Reporte");

                string[] parametros = Data.Split("|");
                string tipdep = "";
                string orden = "";

                parametros[0] = parametros[0].Substring(8, 2) + "/" + parametros[0].Substring(5, 2) + "/" + parametros[0].Substring(0, 4);
                DateTime FechaReporte = DateTime.Now;
                worksheet.Column("A").Width = 60;
                worksheet.Column("B").Width = 8;
                worksheet.Column("C").Width = 18;
                worksheet.Column("D").Width = 4;
                worksheet.Column("E").Width = 12;
                worksheet.Column("F").Width = 12;
                worksheet.Column("G").Width = 9;
                worksheet.Column("H").Width = 9;
                worksheet.Column("I").Width = 12;
                worksheet.Column("J").Width = 6;
                worksheet.Column("K").Width = 12;

                worksheet.Range("A4:K5").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A4:K5").Style.Border.OutsideBorderColor = XLColor.Black;
                worksheet.Range("A5:K5").Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range("A5:K5").Style.Border.InsideBorderColor = XLColor.Black;

                worksheet.Cell("A1").Value = "INFORME MENSUAL INTERNO";
                worksheet.Range("A1:K1").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(18).Font.SetBold();
                worksheet.Cell("A2").Value = "AL " + parametros[0];
                worksheet.Range("A2:K2").Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(14).Font.SetBold();

                worksheet.Cell("A3").Value = "Fecha Reporte : " + FechaReporte;
                worksheet.Range("A3:K3").Merge().Style.Font.SetFontSize(14).Font.SetBold();

                worksheet.Range("A4:K4").Style
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Alignment.SetVertical(XLAlignmentVerticalValues.Center)
                        .Alignment.SetWrapText()
                        .Font.SetBold(true)
                        .Font.SetFontColor(XLColor.White)
                        .Fill.BackgroundColor = XLColor.FromArgb(25, 121, 169);

                worksheet.Cell("A4").Value = "Razón Social";
                worksheet.Cell("B4").Value = "Nro. Orden";
                worksheet.Cell("C4").Value = "DUA";
                worksheet.Cell("D4").Value = "CM";
                worksheet.Cell("E4").Value = "Fecha de Ingreso";
                worksheet.Cell("F4").Value = "Fecha Vencimiento";
                worksheet.Cell("G4").Value = "Cantidad";
                worksheet.Cell("H4").Value = "Peso";
                worksheet.Cell("I4").Value = "CIF Dólares";
                worksheet.Cell("J4").Value = "T/C";
                worksheet.Cell("K4").Value = "CIF Soles";

                string id_cia = HttpContext.Session.GetString("id_cia");
                string id_usr = HttpContext.Session.GetString("id_usr");
                DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
                string rpta = oDaSQL.EjecutarComando("uspRptOperacionesCSV", "pdata", id_cia + "|" + id_usr + "|RptInterno|" + Data);
                string[] lista = rpta.Split("¬");
                int Fila = 5;
                int FilaInicio = 0;
                int FilaFin = 0;
                int li = 0;
                string[] campos = lista[0].Split("|");
                string serie = "";
                decimal totalGeneralG = 0;
                decimal totalGeneralH = 0;
                decimal totalGeneralI = 0;
                decimal totalGeneralK = 0;
                while (li < lista.Length)
                {
                    campos = lista[li].Split("|");
                    serie = campos[0];
                    tipdep = "ALMACEN DE DEPOSITO ";
                    if (parametros[1] == "1")
                    {
                        if(serie=="A") tipdep += "ADUANERO AEREO";
                        else tipdep += "ADUANERO AEREO";
                    }
                    else
                    {
                        tipdep += "SIMPLE";
                    }
                    worksheet.Cell("A" + Fila).Value = tipdep;
                    worksheet.Range("A" + Fila + ":K" + Fila).Merge().Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).Font.SetFontSize(12).Font.SetBold();
                    Fila++;
                    FilaInicio = Fila;
                    while (serie == campos[0])
                    {
                        if (parametros[1] == "1") orden = campos[0] + "-" + campos[1];
                        else orden = campos[1];

                        worksheet.Cell("A" + Fila).Value = campos[2];
                        worksheet.Cell("B" + Fila).Value = orden;
                        worksheet.Cell("C" + Fila).Value = campos[3];
                        worksheet.Cell("D" + Fila).Value = int.Parse(campos[4]);
                        worksheet.Cell("E" + Fila).Value = campos[5];
                        worksheet.Cell("F" + Fila).Value = campos[6];
                        worksheet.Cell("G" + Fila).Value = decimal.Parse(campos[7]);
                        worksheet.Cell("H" + Fila).Value = decimal.Parse(campos[8]);
                        worksheet.Cell("I" + Fila).Value = decimal.Parse(campos[9]);
                        worksheet.Cell("J" + Fila).Value = decimal.Parse(campos[10]);
                        worksheet.Cell("K" + Fila).Value = decimal.Parse(campos[11]);
                        Fila++;
                        li++;
                        if (li >= lista.Length) break;
                        campos = lista[li].Split("|");
                    }
                    FilaFin = Fila - 1;
                    worksheet.Cell("F" + Fila).Value = "SUB-TOTAL=> ";
                    worksheet.Cell("G" + Fila).FormulaA1 = "=SUM(G" + FilaInicio + ":G" + FilaFin + ")";
                    worksheet.Cell("H" + Fila).FormulaA1 = "=SUM(H" + FilaInicio + ":H" + FilaFin + ")";
                    worksheet.Cell("I" + Fila).FormulaA1 = "=SUM(I" + FilaInicio + ":I" + FilaFin + ")";
                    worksheet.Cell("K" + Fila).FormulaA1 = "=SUM(K" + FilaInicio + ":K" + FilaFin + ")";
                    worksheet.Range("G" + Fila + ":K" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                    worksheet.Range("G" + Fila + ":K" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(217, 212, 206, 255);

                    decimal valorG = 0;
                    worksheet.Cell("G" + Fila).TryGetValue(out valorG);
                    totalGeneralG += valorG;

                    decimal valorH = 0;
                    worksheet.Cell("H" + Fila).TryGetValue(out valorH);
                    totalGeneralH += valorH;

                    decimal valorI = 0;
                    worksheet.Cell("I" + Fila).TryGetValue(out valorI);
                    totalGeneralI += valorI;

                    decimal valorK = 0;
                    worksheet.Cell("K" + Fila).TryGetValue(out valorK);
                    totalGeneralK += valorK;

                    Fila += 2;
                }
                worksheet.Range("D6:D" + Fila).Style.NumberFormat.Format = "0";
                worksheet.Range("E6:F" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center).DateFormat.Format = "dd/mm/yyyy";
                worksheet.Range("G6:H" + Fila).Style.NumberFormat.Format = "#,##0";
                worksheet.Range("I6:I" + Fila).Style.NumberFormat.Format = "#,##0.00;[Red](#,##0.00)";
                worksheet.Range("J6:J" + Fila).Style.NumberFormat.Format = "0.000";
                worksheet.Range("K6:K" + Fila).Style.NumberFormat.Format = "#,##0.00;[Red](#,##0.00)";

                worksheet.Cell("F" + Fila).Value = "TOTAL GENERAL=>";
                worksheet.Range("F" + Fila + ":K" + Fila).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right).Font.SetBold();
                worksheet.Range("G" + Fila + ":K" + Fila).Style.Font.SetBold(true).Fill.BackgroundColor = XLColor.FromArgb(36, 152, 189, 255);

                worksheet.Cell("G" + Fila).Value = totalGeneralG;
                worksheet.Cell("H" + Fila).Value = totalGeneralH;
                worksheet.Cell("I" + Fila).Value = totalGeneralI;
                worksheet.Cell("K" + Fila).Value = totalGeneralK;

                string NombreXLS = "RI_" + FechaReporte.ToString("yyyyMMddHHmmss") + ".xlsx";
                worksheet.Protect(NombreXLS);

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", NombreXLS);
                }
            }
        }

        #endregion RptInterno

    }
}