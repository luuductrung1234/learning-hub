using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace simple_dotnetcore_console
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var services = new ServiceCollection();
            ConfigureServices(services);

            var serviceProvider = services.BuildServiceProvider();

            await serviceProvider.GetRequiredService<App>().Run();
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(builder => 
                builder.AddDebug()
                       .AddConsole()
                );
            
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .AddEnvironmentVariables()
                .Build();

            services.AddOptions();
            services.Configure<AppSettings>(configuration.GetSection("App"));

            services.AddTransient<App>();
        }
    }
}
