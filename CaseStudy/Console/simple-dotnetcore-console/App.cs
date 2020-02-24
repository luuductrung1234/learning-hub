using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace simple_dotnetcore_console
{
    public class App
    {
        private readonly ILogger<App> _logger;
        private readonly AppSettings _appSettings;

        public App(IOptions<AppSettings> appSettings, ILogger<App> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _appSettings = appSettings?.Value ?? throw new ArgumentNullException(nameof(appSettings));
        }

        public async Task Run()
        {
            Console.WriteLine();
            Console.WriteLine("Hello world!");
            Console.WriteLine();
            Console.WriteLine("Setting:");
            Console.WriteLine($"Temp Directory: {_appSettings.TempDirectory}");
            Console.WriteLine($"Enable: {_appSettings.Enable}");
            Console.WriteLine();

            await Task.CompletedTask;
        }
    }
}