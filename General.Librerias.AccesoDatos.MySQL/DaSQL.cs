using MySqlConnector;
using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

namespace General.Librerias.AccesoDatos.MySQL
{
#pragma warning disable CS1520
#pragma warning disable CS8600
#pragma warning disable CS8603
#pragma warning disable CS8618
    public class DaSQL
    {
#pragma warning disable CS1520
#pragma warning disable CS8600
#pragma warning disable CS8603
#pragma warning disable CS8618
        public string ConnectionString { get; set; }
        public string ConnectionStringSQLServer { get; set; }
        public DaSQL(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
        public string EjecutarComando(string NombreSP, string ParametroNombre = "", string ParametroValor = "")
        {
            string rpta = "";
            using (MySqlConnection con = new(ConnectionString))
            {
                try
                {
                    con.Open();
                    MySqlCommand cmd = new(NombreSP, con)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    if (!string.IsNullOrEmpty(ParametroNombre) && !string.IsNullOrEmpty(ParametroValor))
                    {
                        cmd.Parameters.Add(new MySqlParameter(ParametroNombre, ParametroValor));
                    }
                    object data = cmd.ExecuteScalar();
                    if (data != null) rpta = data.ToString();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    //Pass the filepath and filename to the StreamWriter Constructor
                    StreamWriter sw = new("ErrorDaSQL.txt");
                    //Write a line of text
                    sw.WriteLine(ConnectionString);
                    sw.WriteLine("-------------------");
                    sw.WriteLine(e.ToString());
                    //Close the file
                    sw.Close();
                    //rpta = "cadena de conexion " + ConnectionString + "   error " + ex.ToString();
                    //rpta = "Error: " + e.Message.ToString();
                }
            }
            return rpta;
        }
        public async Task<string> EjecutarComandoAwait(string NombreSP, string ParametroNombre = "", string ParametroValor = "")
        {
            string rpta = "";
            using (MySqlConnection con = new(ConnectionString))
            {
                try
                {
                    await con.OpenAsync();
                    MySqlCommand cmd = new(NombreSP, con)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    if (!string.IsNullOrEmpty(ParametroNombre) && !string.IsNullOrEmpty(ParametroValor))
                    {
                        cmd.Parameters.Add(new MySqlParameter(ParametroNombre, ParametroValor));
                    }
                    object data = cmd.ExecuteScalarAsync();
                    if (data != null) rpta = data.ToString();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    //Pass the filepath and filename to the StreamWriter Constructor
                    StreamWriter sw = new("ErrorDaSQL.txt");
                    //Write a line of text
                    sw.WriteLine(ConnectionString);
                    sw.WriteLine("-------------------");
                    sw.WriteLine(e.ToString());
                    //Close the file
                    sw.Close();
                    //rpta = "cadena de conexion " + ConnectionString + "   error " + ex.ToString();
                    //rpta = "Error: " + e.Message.ToString();
                }
            }
            return rpta;
        }
    }

    public class DaSQLServer
    {
        public string ConnectionStringSQLServer { get; set; }
        public DaSQLServer(string connectionStringSQLServer)
        {
            this.ConnectionStringSQLServer = connectionStringSQLServer;
        }
        public string EjecutarComandoSQLServer(string NombreSP, string ParametroNombre = "", string ParametroValor = "")
        {
            string rpta = "";
            using (SqlConnection con = new(ConnectionStringSQLServer))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new(NombreSP, con)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    if (!string.IsNullOrEmpty(ParametroNombre) && !string.IsNullOrEmpty(ParametroValor))
                    {
                        cmd.Parameters.Add(new SqlParameter(ParametroNombre, ParametroValor));
                    }
                    object data = cmd.ExecuteScalar();
                    if (data != null) rpta = data.ToString();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    StreamWriter sw = new("ErrorDaSQLServer.txt");
                    sw.WriteLine(ConnectionStringSQLServer);
                    sw.WriteLine("-------------------");
                    sw.WriteLine(e.ToString());
                    sw.Close();
                }
            }
            return rpta;
        }
        public string EjecutarComandoInternoSQLServer(string NombreSP, string ParametroNombre = "", string ParametroValor = "")
        {
            string rpta = "";
            using (SqlConnection con = new(ConnectionStringSQLServer))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new(NombreSP, con)
                    {
                        CommandType = CommandType.Text
                    };
                    object data = cmd.ExecuteScalar();
                    if (data != null) rpta = data.ToString();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    StreamWriter sw = new("ErrorDaSQLServer.txt");
                    sw.WriteLine(ConnectionStringSQLServer);
                    sw.WriteLine("-------------------");
                    sw.WriteLine(e.ToString());
                    sw.Close();
                }
            }
            return rpta;
        }

    }
}