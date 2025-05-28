using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using System.Text;
using System.Text.Json;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IServiceScopeFactory scopeFactory,
        IHttpContextAccessor httpContextAccessor)
    {
        _next = next;
        _logger = logger;
        _scopeFactory = scopeFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            string requestBody = await ReadRequestBodyAsync(context);

            //string userId = "anonymous";
            //var userIdClaim = context.User?.FindFirst("UserId");
            //if (userIdClaim != null)
            //{
            //    userId = userIdClaim.Value;
            //}

            //string requestUri = context.Request.Path;
            //string httpMethod = context.Request.Method;

            //int statusCode = StatusCodes.Status500InternalServerError; // Default to 500

            //// Create a new scope to resolve scoped services like DbContext
            //using (var scope = _scopeFactory.CreateScope())
            //{
            //    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            //    var log = new Log
            //    {
            //        RequestUri = requestUri,
            //        HttpMethod = httpMethod,
            //        StatusCode = statusCode,
            //        ResponseContent = ex.InnerException.Message,
            //        ExceptionMessage = ex.Message,
            //        StackTrace = ex.StackTrace,
            //        CreatedAt = DateTime.UtcNow,
            //        CreatedBy = userId
            //    };

            //    dbContext.Logs.Add(log);
            //    await dbContext.SaveChangesAsync();
            //}

            await HandleExceptionAsync(context, ex);
        }
    }


    private async Task<string> ReadRequestBodyAsync(HttpContext context)
    {
        context.Request.EnableBuffering(); // Allows reading the body multiple times

        context.Request.Body.Position = 0;
        using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
        string body = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0; // Reset again for further use

        return body;
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response = new ApiResponse<string>
        {
            IsSuccess = false,
            Message = exception.Message,
            Errors = new List<string> { exception.InnerException?.Message }.Where(msg => !string.IsNullOrWhiteSpace(msg))
        };

        var json = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(json);
    }
}

