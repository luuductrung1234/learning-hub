
namespace ShoppingCartService.Dependency
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.DependencyInjection;
    using Polly;
    using Polly.Extensions.Http;
    using ShoppingCartService.Services;

    public static class ServiceCommunicateExtensions
    {
        public static IServiceCollection AddExternalServices(this IServiceCollection services)
        {
            services.AddHttpClient<IProductCatalogClient, ProductCatalogClient>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .AddPolicyHandler(GetRetryPolicy());

            return services;
        }

        static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
                .WaitAndRetryAsync(6, retryAttemp => TimeSpan.FromSeconds(Math.Pow(2, retryAttemp)));
        }
    }
}