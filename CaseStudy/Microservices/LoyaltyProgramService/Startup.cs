namespace LoyaltyProgramService
{
    using System;
    using LoyaltyProgramService.Repositories;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Nancy;
    using Nancy.Bootstrapper;
    using Nancy.Configuration;
    using Nancy.Owin;

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
        /// <summary>
        /// Override default Nancy behavior when handle responses.
        /// Clear all default StatusCodeHandlers (not attach HTML error page in the body of response)
        /// </summary>
        protected override Func<ITypeCatalog, NancyInternalConfiguration> InternalConfiguration => NancyInternalConfiguration.WithOverrides(builder => builder.StatusCodeHandlers.Clear());

        protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
        {
            container.Register<IUserStore, UserStore>().AsSingleton();
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
