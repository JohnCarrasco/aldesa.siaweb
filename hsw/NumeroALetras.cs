using System;
using System.Text;
namespace hsw
{
    public static class NumeroALetras
    {
        private static string[] unidades = { "", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve" };
        private static string[] decenas = { "", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa" };
        private static string[] especiales = { "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veintiún", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve" };
        private static string[] centenas = { "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos" };
        private static string[] miles = { "", "mil", "millón", "mil millones", "billón", "mil billones", "trillón", "mil trillones", "cuatrillón", "mil cuatrillones" };

        public static string Convertir(int numero)
        {
            if (numero == 0)
            {
                return "cero";
            }

            if (numero < 0)
            {
                return "menos " + Convertir(Math.Abs(numero));
            }

            StringBuilder sb = new StringBuilder();
            int grupo = 0;

            while (numero > 0)
            {
                int grupoNumero = numero % 1000;
                if (grupoNumero != 0)
                {
                    string textoGrupo = ConvertirGrupo(grupoNumero);
                    if (grupo > 0)
                    {
                        if (grupo == 1 && grupoNumero == 1)
                        {
                            sb.Insert(0, miles[grupo] + " ");
                        }
                        else if (grupo == 2 && grupoNumero == 1)
                        {
                            sb.Insert(0, miles[grupo] + " ");
                        }
                        else
                        {
                            sb.Insert(0, miles[grupo] + " ");
                        }
                    }
                    sb.Insert(0, textoGrupo + " ");
                }
                numero /= 1000;
                grupo++;
            }

            return sb.ToString().Trim();
        }

        private static string ConvertirGrupo(int numero)
        {
            StringBuilder sb = new StringBuilder();
            int cent = numero / 100;
            int dec = (numero % 100) / 10;
            int uni = numero % 10;

            if (cent > 0)
            {
                sb.Append(centenas[cent] + " ");
                if (dec == 0 && uni == 0)
                {
                    // No se agrega "ciento" solo
                }
                else if (cent == 1)
                {
                    // "ciento" se agrega solo si hay decenas o unidades
                }
            }

            if (dec == 1)
            {
                sb.Append(especiales[uni] + " ");
            }
            else if (dec == 2 && uni >= 1 && uni <= 9)
            {
                sb.Append(especiales[10 + uni] + " ");
            }
            else
            {
                if (dec > 0)
                {
                    sb.Append(decenas[dec] + " ");
                }
                if (uni > 0)
                {
                    if (dec > 0)
                    {
                        sb.Append("y " + unidades[uni] + " ");
                    }
                    else
                    {
                        sb.Append(unidades[uni] + " ");
                    }
                }
            }

            return sb.ToString().Trim();
        }

        public static string ConvertirDecimalMoneda(decimal numero, string moneda)
        {
            int entero = (int)Math.Floor(numero);
            int centavos = (int)Math.Round((numero - entero) * 100);

            string textoEntero = Convertir(entero);
            string textoCentavos = centavos.ToString().PadLeft(2, '0');

            string resultado = "";

            if (entero == 1)
            {
                resultado += "un " + moneda + " con ";
            }
            else if (entero > 1)
            {
                resultado += textoEntero + " con ";
            }
            else if (entero == 0 && centavos > 0)
            {
                resultado += "cero con ";
            }
            else if (entero == 0 && centavos == 0)
            {
                resultado += "cero ";
            }

            resultado += textoCentavos + "/100 " + moneda.ToUpper(); // Asumiendo que la parte decimal siempre es "centavos" de la moneda

            //if (centavos > 0)
            //{
            //}
            //else if (entero > 0)
            //{
            //    // Si no hay centavos, no agregar "con 00/100 MONEDA"
            //}

            return resultado.Trim();
        }
    }
}
