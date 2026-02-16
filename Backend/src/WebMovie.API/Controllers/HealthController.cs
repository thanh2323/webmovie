using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebMovie.Infrastructure.Data;

namespace WebMovie.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> CheckHealth()
    {
        var healthStatus = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Database = "Unknown"
        };

        try
        {
            // Just check if we can connect
            if (await _context.Database.CanConnectAsync())
            {
                healthStatus = new 
                { 
                    Status = "Healthy", 
                    Timestamp = DateTime.UtcNow, 
                    Database = "Connected" 
                };
            }
            else
            {
                healthStatus = new 
                { 
                    Status = "Degraded", 
                    Timestamp = DateTime.UtcNow, 
                    Database = "Disconnected" 
                };
            }
        }
        catch (Exception ex)
        {
             healthStatus = new 
            { 
                Status = "Unhealthy", 
                Timestamp = DateTime.UtcNow, 
                Database = $"Error: {ex.Message}" 
            };
        }

        return Ok(healthStatus);
    }
}
