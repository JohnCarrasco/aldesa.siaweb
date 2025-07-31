using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using General.Librerias.AccesoDatos.MySQL;
using hsw.Filters;
using DocumentFormat.OpenXml.Wordprocessing; //DaSQL

namespace hsw.Controllers
{
    [FiltroAutenticacion]
    public class ModFacturacionController : Controller
    {
        #pragma warning disable CS8600
        #pragma warning disable CS8602

        #region ManteFacturas
        public ActionResult ManteFacturas()
        {
            return View();
        }
        public string ManteFacturasCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data);
            return rpta;
        }
        public string ManteFacturasGrbCSV()
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            StreamReader sr = new(Request.Body);
            var Data = sr.ReadToEndAsync();
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            string rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|" + Data.Result);
            return rpta;
        }
        public string ManteFacturasDataSmartCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            string ruc = HttpContext.Session.GetString("ruc");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            DaSQLServer oDaSQLServer = HttpContext.RequestServices.GetService(typeof(DaSQLServer)) as DaSQLServer;

            string[] reg = Data.Split("|");
            string rpta = "";
            string sSql = "";
            string xtipdoc = "0" + reg[1];
            string xnumdocMySQL = reg[2];
            string xnumdoc = string.Concat(reg[2].AsSpan(0, 4), "-", reg[2].AsSpan(4, 8));
            string[] listas;
            string[] lista;
            string tipo = "";
            string codigo = "";
            string texto = "";

            sSql = "SELECT COUNT(*) reg FROM tbl_de_cabecera WHERE tipoDocumentoEmisor='6' AND numeroDocumentoEmisor='" + ruc
            + "' AND tipoDocumento='" + xtipdoc + "' AND serieNumero='" + xnumdoc + "'";

            rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
            if (int.Parse(rpta) == 0)
            {
                #region tbl_de_detalle
                rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|env|" + xtipdoc + "|" + xnumdocMySQL);
                listas = rpta.Split("¯");
                lista = listas[0].Split("¬");
                int li = 0;
                while (li < lista.Length)
                {
                    reg = lista[li].Split("|");

                    sSql = "INSERT INTO tbl_de_detalle(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero,numeroOrdenItem," +
                    "codigoProducto,descripcion,cantidad,unidadMedida,codigoRazonExoneracion,codigoImporteUnitarioConImpues," +
                    "importeUnitarioConImpuesto,importeUnitarioSinImpuesto,importeReferencial,importeCargo," +
                    "importeDescuento,importeTotalSinImpuesto,importeIgv,importeIsc,tasa_icbper,icbper) " +
                    "VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "'," + reg[0] + ",'" + reg[1] + "','" + reg[2] +
                    "'," + reg[3] + ",'" + reg[4] + "','" + reg[5] + "','" + reg[6] + "'," + reg[7] + "," + reg[8] + "," + reg[9] +
                    "," + reg[10] + "," + reg[11] + "," + reg[12] + "," + reg[13] + "," + reg[14] + "," + reg[15] + "," + reg[16] + ")";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    li++;
                }
                #endregion tbl_de_detalle

                #region tbl_de_cuotas
                reg = listas[1].Split("|");
                if (reg[0] == "2")
                {
                    sSql = "INSERT INTO tbl_de_cuotas(TIPO_DOCUMENTO_EMISOR,NUMERO_DOCUMENTO_EMISOR,TIPO_DOCUMENTO,SERIE_NUMERO,ID_CUOTA," +
                    "FECHA_CUOTA,TOTAL_CUOTA) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','Cuota001','" + reg[1] + "','" +
                    reg[2] + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }
                #endregion tbl_de_cuotas

                #region cabecera_adicionales_leyendas
                reg = listas[2].Split("|");

                //Fecha de Vencimiento
                tipo = "A";
                codigo = "8003";
                texto = reg[0];
                sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                //Días de crédito
                if (xtipdoc !="07")
                {
                    codigo = "9001";
                    texto = reg[1];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                //Observaciones
                codigo = "9005";
                texto = reg[2];
                sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                //Tipo de cambio
                if (decimal.Parse(reg[3])>0)
                {
                    codigo = "9014";
                    texto = reg[3];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                //Centro de Costo
                if (reg[4]!= ""){
                    codigo = "9015";
                    texto = reg[4];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                if (xtipdoc == "07"){
                    //Fecha de documento de Referencia
                    if (reg[23] != "")
                    {
                        codigo = "9212";
                        texto = reg[23];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }


                }
                else {
                    //Documento de Referencia
                    if (reg[5] != "")
                    {
                        codigo = "9200";
                        texto = reg[5];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Codigo
                    codigo = "9201";
                    texto = reg[6];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                    //Nro. DUA
                    if (reg[7] != "")
                    {
                        codigo = "9202";
                        texto = reg[7];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Bultos
                    if (reg[8] != "0")
                    {
                        codigo = "9203";
                        texto = reg[8];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Nro. de Orden (tarjeta)
                    if (reg[9] != "")
                    {
                        codigo = "9204";
                        texto = reg[9];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Unidad de Medida de bultos
                    if (reg[10] != "")
                    {
                        codigo = "9205";
                        texto = reg[10];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Fecha de Inicio de Periodo
                    if (reg[11] != "")
                    {
                        codigo = "9206";
                        texto = reg[11];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Fecha de Fin de Periodo
                    if (reg[12] != "")
                    {
                        codigo = "9207";
                        texto = reg[12];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Valor de los bultos que se toma para calculo de comision
                    if (reg[13] != "0.00")
                    {
                        codigo = "9208";
                        texto = reg[13];
                        sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                        "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                        rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    }

                    //Dias Periodo Facturación
                    codigo = "9209";
                    texto = reg[14];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }


                //Descripción Mercadería
                if (reg[15] != "")
                {
                    codigo = "9210";
                    texto = reg[15];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                //Tarifa porcentual
                if (reg[16] != "0.00%")
                {
                    codigo = "9211";
                    texto = reg[16];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                //Leyenda
                if (reg[17] != "")
                {
                    codigo = "9213";
                    texto = reg[17];
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }

                //Importe total del documento en letras
                if (reg[18] != "0.00")
                {
                    tipo = "L";
                    codigo = "1000";
                    texto = NumeroALetras.ConvertirDecimalMoneda(decimal.Parse(reg[18]), reg[19]).ToUpper();
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                }
                //Porcentaje detraccion
                if (reg[21] != "0.00")
                {
                    tipo = "L";
                    codigo = "2006";
                    texto = "Demás servicios gravados con el IGV";
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                    tipo = "L";
                    codigo = "3000";
                    texto = "037";
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                    tipo = "L";
                    codigo = "3001";
                    texto = "00001061585";
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                    tipo = "L";
                    codigo = "8013";
                    texto = "001";
                    sSql = "INSERT INTO tbl_de_cabecera_adicionales_leyendas(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero," +
                    "tipo,codigo,texto) VALUES('6','" + ruc + "','" + xtipdoc + "','" + xnumdoc + "','" + tipo + "','" + codigo + "','" + texto + "')";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                }
                #endregion cabecera_adicionales_leyendas

                #region cabecera
                reg = listas[3].Split("|");
                sSql = "INSERT INTO tbl_de_cabecera(tipoDocumentoEmisor,numeroDocumentoEmisor,tipoDocumento,serieNumero,fechaEmision," +
                "razonSocialEmisor,nombreComercialEmisor,paisEmisor,departamentoEmisor,provinciaEmisor,distritoEmisor,urbanizacion," +
                "direccionEmisor,ubigeoEmisor,tipoDocumentoAdquiriente,numeroDocumentoAdquiriente,razonSocialAdquiriente," +
                "direccionCompletaadquiriente,correoAdquiriente,tipoMoneda,totalValorVentaNetoOpGravadas,totalValorVentaNetoOpNoGravada," +
                "totalPercepcion,totalValorVentaNetoOpGratuitas,totalValorVentaNetoOpExonerada,descuentosGlobales,totalOtrosCargos," +
                "totalDescuentos,totaligv,totalIsc,totalOtrosTributos,totalventa,totalDetraccion,valorReferencialDetraccion," +
                "descripcionDetraccion,baseImponiblePercepcion,totalVentaConPercepcion,porcentajeigv,porcentajeDetraccion," +
                "porcentajePercepcion,estadoRegistro,enviocorreo,enviaremail,tipooperacion,total_icbper,formapago,codigoserienumeroafectado," +
                "tipodocumentoreferenciaprincip,numerodocumentoreferenciaprinc,motivodocumento) VALUES('6','" + ruc + "','" + 
                xtipdoc + "','" + xnumdoc + "','" + reg[0] + "','" + reg[1] + "','" + reg[2] + "','" + reg[3] + "','" + reg[4] + "','" + 
                reg[5] + "','" + reg[6] + "','" + reg[7] + "','" + reg[8] + "','" + reg[9] + "','" + reg[10] + "','" + reg[11] + "','" + 
                reg[12] + "','" + reg[13] + "','" + reg[14] + "','" + reg[15] + "','" + reg[16] + "','" + reg[17] + "','" + reg[18] + "','" + 
                reg[19] + "','" + reg[20] + "','" + reg[21] + "','" + reg[22] + "','" + reg[23] + "','" + reg[24] + "','" + reg[25] + "','" + 
                reg[26] + "','" + reg[27] + "','" + reg[28] + "','" + reg[29] + "','" + reg[30] + "','" + reg[31] + "','" + reg[32] + "','" + 
                reg[33] + "','" + reg[34] + "','" + reg[35] + "','" + reg[36] + "','" + reg[37] + "','" + reg[38] + "','" + reg[39] + "','" + 
                reg[40] + "','" + reg[41] + "','" + reg[42] + "','" + reg[43] + "','" + reg[44] + "','" + reg[45] + "')";
                rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                rpta = listas[4];
                #endregion cabecera

                #region contabilidad
                reg = listas[5].Split("|");
                sSql = "exec bd_aldesa_erp.dbo.usp_grabar_clientes_express " + reg[0] + ",'" + reg[1] + "','" + reg[2] + "','" + reg[3] + "','" + reg[4] + "'";
                rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);

                sSql = "exec bd_aldesa_erp.dbo.usp_importa_comprobante '20100392403','" + xtipdoc + "','" + xnumdoc + "','BD_ALDESA_FFEE'";
                rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                #endregion contabilidad

            }
            return rpta;
        }
        public string ManteFacturasDSVerificarCSV(string Data)
        {
            string id_cia = HttpContext.Session.GetString("id_cia");
            string id_usr = HttpContext.Session.GetString("id_usr");
            string ruc = HttpContext.Session.GetString("ruc");
            DaSQL oDaSQL = HttpContext.RequestServices.GetService(typeof(DaSQL)) as DaSQL;
            DaSQLServer oDaSQLServer = HttpContext.RequestServices.GetService(typeof(DaSQLServer)) as DaSQLServer;
            string[] lista;
            string[] reg;
            string sSql = "";
            string rpta = "";
            rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|sun|" + Data);
            lista = rpta.Split("¬");
            int li = 0;
            if (rpta != "")
            {
                while (li < lista.Length)
                {
                    reg = lista[li].Split("|");
                    sSql = "SELECT estadoProceso + '|' + enviocorreo + '|' + mensajeSunat FROM tbl_de_cabecera WHERE numeroDocumentoEmisor='" + 
                        ruc + "' AND serieNumero='" + reg[1] + "' AND tipoDocumento='" + reg[0] + "' AND tipoDocumentoEmisor='6'";
                    rpta = oDaSQLServer.EjecutarComandoInternoSQLServer(sSql);
                    rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|sug|" + lista[li] + "|" + rpta);
                    li++;
                }
            }
            rpta = oDaSQL.EjecutarComando("uspManteFacturasCSV", "pdata", id_cia + "|" + id_usr + "|lst|" + Data);
            return rpta;
        }

        #endregion ManteFacturas

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
    }
}
