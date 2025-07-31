using General.Librerias.AccesoDatos.MySQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
#pragma warning disable CS8604
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();
builder.Services.Add(new ServiceDescriptor(typeof(DaSQL), new DaSQL(builder.Configuration.GetConnectionString("dbaldesa"))));
builder.Services.Add(new ServiceDescriptor(typeof(DaSQLServer), new DaSQLServer(builder.Configuration.GetConnectionString("dbaldesaFFEE"))));
builder.Host.ConfigureHostOptions(o => o.ShutdownTimeout = TimeSpan.FromMinutes(32));
//builder.Host.ConfigureHostOptions(o => o.ShutdownTimeout = TimeSpan.FromSeconds(30));
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(32);
    //options.IdleTimeout = TimeSpan.FromSeconds(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
          builder =>
          {
              builder.AllowAnyOrigin()
                     .AllowAnyHeader()
                     .AllowAnyMethod();
          });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080, options => options.UseHttps());
    //    options.ListenLocalhost(8080);

    //options.ListenAnyIP(7022);
    //options.ListenAnyIP(7022, options => options.UseHttps()); // Puerto configurado
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.UseCors("AllowAllOrigins");
app.UseAuthorization();

//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllerRoute(
//        name: "default",
//        pattern: "{controller=HSW}/{action=Login}/{id?}");
//    //endpoints.MapHub<Hubs.ChatHub>("/chatHub");
//});

#pragma warning disable ASP0014 // Suggest using top level route registrations
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "clientes",
        pattern: "Clientes",
        defaults: new { controller = "Clientes", action = "Clientes" });

    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=HSW}/{action=Login}/{id?}");
});
#pragma warning restore ASP0014 // Suggest using top level route registrations
app.Run();



