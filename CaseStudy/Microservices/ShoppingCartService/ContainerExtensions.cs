using Microsoft.Extensions.Configuration;
using Nancy.TinyIoc;

namespace ShoppingCartService
{
    internal static class ContainerExtensions
    {
        public static void Configure<TOptions>(this TinyIoCContainer container, IConfiguration configuration)
            where TOptions : class, new()
        {
            var options = new TOptions();
            configuration.Bind(options);
            container.Register(options);
        }
    }
}