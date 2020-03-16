namespace ShoppingCartService
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Nancy;
    using Nancy.Configuration;
    using Nancy.Owin;
    using ShoppingCartService.EventFeed;
    using ShoppingCartService.Services;
    using ShoppingCartService.ShoppingCart;

    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseOwin().UseNancy(opt => opt.Bootstrapper = new TracingBootstrapper());
        }
    }

    public class TracingBootstrapper : Nancy.DefaultNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
        {
            container.Register<IShoppingCartStore, ShoppingCartStore>().AsSingleton();
            container.Register<IEventStore, EventStore>().AsSingleton();
            container.Register<IProductCatalogClient, ProductCatalogClient>().AsMultiInstance();
        }

        protected override void ConfigureRequestContainer(Nancy.TinyIoc.TinyIoCContainer container, NancyContext context)
        {
            // no scoped denpendency.
        }

        public override void Configure(INancyEnvironment env)
        {
            env.Tracing(enabled: true, displayErrorTraces: true);
        }
    }
}
