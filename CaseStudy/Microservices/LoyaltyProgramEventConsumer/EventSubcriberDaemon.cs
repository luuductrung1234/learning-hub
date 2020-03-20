namespace LoyaltyProgramEventConsumer
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public class EventSubcriberDaemon : HttpEventSubcriber, IHostedService, IDisposable
    {
        private readonly ILogger<EventSubcriberDaemon> _logger;
        private readonly DaemonConfig _config;
        private readonly Timer _timer;

        public EventSubcriberDaemon(ILogger<EventSubcriberDaemon> logger, IOptions<DaemonConfig> daemonConfig, IOptions<EventSubcriberConfig> subcriberConfig)
            : base(subcriberConfig?.Value?.EventHost, logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _config = daemonConfig?.Value ?? throw new ArgumentNullException(nameof(daemonConfig));

            // construct a timer but not started yet
            this._timer = new Timer(_ => SubscriptionCycleCallback().Wait(),
                                   null,
                                   Timeout.Infinite,
                                   Timeout.Infinite);
        }

        public virtual async Task SubscriptionCycleCallback()
        {
            try
            {
                this._logger.LogTrace("Start New Cycle");
                var @event = await ReadEvents();
                if (IsValidEvent(@event))
                    await HandleEvents(@event);
                this._logger.LogTrace("End Cycle");
                this._timer.Change(0, Timeout.Infinite);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex.Message);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting: " + _config.DaemonName);
            this._timer.Change(0, Timeout.Infinite);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping: " + _config.DaemonName);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            this._timer.Dispose();
            _logger.LogInformation("Disposing " + _config.DaemonName);
        }
    }
}