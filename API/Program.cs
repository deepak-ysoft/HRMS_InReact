using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.ServiceContent;
using HRMS.IServices;
using HRMS.ServiceContent;
using HRMS.ViewModel.Request;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Register IHttpContextAccessor for use in middleware
builder.Services.AddHttpContextAccessor();

// Configure request size limits
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 MB
});
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 104857600; // 100 MB
});

// Register services
builder.Services.AddScoped<ICandidateService, CandidateServiceContent>();
builder.Services.AddScoped<ICalendarService, CalendarServiceContent>();
builder.Services.AddScoped<IEmployee, EmployeeServiceContent>();
builder.Services.AddScoped<IEmployeeLeave, EmployeeLeaveServiceContent>();
builder.Services.AddScoped<IAccount, AccountServiceContent>();
builder.Services.AddScoped<IAuthService, AuthServiceContent>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ILeadsService, LeadsServiceContent>();
builder.Services.AddScoped<IAttendanceService, AttendanceServiceContent>();
builder.Services.AddScoped<IDocumentService, DocumentServiceContent>();
builder.Services.AddScoped<IPayrollService, PayrollServiceContent>();
builder.Services.AddScoped<IPerformanceReviewService, PerformanceReviewServiceContent>();

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddTransient<EmailService>();

// Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert Jwt with Bearer into field.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
});

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefConn"));
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
               .SetIsOriginAllowed(origin => true);
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowAll");

// Use custom exception middleware
app.UseMiddleware<ExceptionMiddleware>();

// Ensure static file directories exist
string uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
string candidateCvPath = Path.Combine(builder.Environment.ContentRootPath, "CandidateCV");

if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

if (!Directory.Exists(candidateCvPath))
    Directory.CreateDirectory(candidateCvPath);

// Serve static files
app.UseStaticFiles(); // General static files

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(candidateCvPath),
    RequestPath = "/CandidateCV"
});

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// HTTPS redirection
app.UseHttpsRedirection();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Run the app
app.Run();
