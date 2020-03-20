namespace LoyaltyProgramEventConsumer
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = CreateDaemonGenericHost(args);
            await builder.RunConsoleAsync();
        }

        static IHostBuilder CreateDaemonGenericHost(string[] args)
            => new HostBuilder()
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config
                        .AddEnvironmentVariables()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: true);
                    // string environmentName = hostingContext.HostingEnvironment.EnvironmentName;
                    string environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (!String.IsNullOrWhiteSpace(environmentName))
                        config.AddJsonFile($"appsettings.{environmentName}.json", optional: true);
                    if (args != null)
                        config.AddCommandLine(args);
                })
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddOptions();
                    services.Configure<DaemonConfig>(hostContext.Configuration.GetSection("Daemon"));
                    services.Configure<EventSubcriberConfig>(hostContext.Configuration.GetSection("EventSubcriber"));
                    services.AddSingleton<IHostedService, EventSubcriberDaemon>();
                })
                .ConfigureLogging((hostingContext, logging) =>
                {
                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                });

    }
}
