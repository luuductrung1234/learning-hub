namespace ShoppingCartService
{
    using System;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Nancy;
    using Nancy.Configuration;
    using Nancy.Responses.Negotiation;
    using ShoppingCartService.EventFeed;
    using ShoppingCartService.EventFeed.Configurations;
    using ShoppingCartService.Services;
    using ShoppingCartService.Services.Configurations;
    using ShoppingCartService.ShoppingCart;
    using ShoppingCartService.ShoppingCart.Configurations;

    public class TracingBootstrapper : Nancy.DefaultNancyBootstrapper
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TracingBootstrapper> _logger;

        public TracingBootstrapper(IConfiguration configuration, ILogger<TracingBootstrapper> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
            pipelines.OnError += OnError;
        }

        protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register<IShoppingCartStore, ShoppingCartStore>().AsSingleton();
            container.Register<IEventStore, EventStore>().AsSingleton();
            container.Register<IProductCatalogClient, ProductCatalogClient>().AsMultiInstance();

            container.Configure<ProductCatalogClientConfig>(_configuration.GetSection("ProductCatalogClient"));
            container.Configure<ShoppingCartStoreConfig>(_configuration.GetSection("ShoppingCartStore"));
            container.Configure<EventStoreConfig>(_configuration.GetSection("EventStore"));
        }

        protected override void ConfigureRequestContainer(Nancy.TinyIoc.TinyIoCContainer container, NancyContext context)
        {
            // no scoped denpendency.
            base.ConfigureRequestContainer(container, context);
        }

        public override void Configure(INancyEnvironment env)
        {
            env.Tracing(enabled: true, displayErrorTraces: true);
        }

        private Response OnError(NancyContext context, Exception ex)
        {
            _logger.LogError(ex, "An unhandled error occured.");
            var negotiator = ApplicationContainer.Resolve<IResponseNegotiator>();
            return negotiator.NegotiateResponse(new
            {
                Error = "Internal error. Please see server log for details"
            }, context);
        }
    }
}
