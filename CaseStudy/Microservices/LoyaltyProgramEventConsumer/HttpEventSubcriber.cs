namespace LoyaltyProgramEventConsumer
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading;
    using System.Threading.Tasks;
    using LoyaltyProgramEventConsumer.Models;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;

    public abstract class HttpEventSubcriber : IEventSubcriber<HttpResponseMessage>
    {
        private readonly string _eventHost;
        private readonly ILogger _logger;
        private long _start = 0, _chunkSize = 100;

        public HttpEventSubcriber(string eventHost, ILogger logger)
        {
            if (string.IsNullOrWhiteSpace(eventHost))
                throw new ArgumentException(nameof(eventHost));
            this._eventHost = eventHost;
            this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public virtual bool IsValidEvent(HttpResponseMessage @event)
        {
            return @event.StatusCode == HttpStatusCode.OK;
        }

        public virtual async Task HandleEvents(HttpResponseMessage @event)
        {
            var content = await @event.Content.ReadAsStringAsync();
            this._logger.LogTrace("Start Handle Events");
            var events = JsonConvert.DeserializeObject<IEnumerable<Event>>(content);
            Console.WriteLine(events);
            Console.WriteLine(events.Count());
            foreach (var ev in events)
            {
                Console.WriteLine(ev.Content);
                dynamic eventData = ev.Content;
                Console.WriteLine("product name from data: " + (string)eventData.offer.productName);
                this._start = Math.Max(this._start, ev.SequenceNumber + 1);
            }
            this._logger.LogTrace("Start Handle Events");
        }

        public async Task<HttpResponseMessage> ReadEvents()
        {
            this._logger.LogTrace($"Start Read Events from host:{this._eventHost}, with top:{this._start} & end:{this._start + this._chunkSize}");
            var eventResource = $"/events/?start={this._start}&end={this._start + this._chunkSize}";
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.BaseAddress = new Uri(this._eventHost);
                var response = await httpClient.GetAsync(eventResource);
                PrettyPrintResponse(response);
                this._logger.LogTrace($"End Read Events from host:{this._eventHost}");
                return response;
            }
        }

        private async void PrettyPrintResponse(HttpResponseMessage response)
        {
            Console.WriteLine("Status code: " + response?.StatusCode.ToString() ?? "command failed");
            Console.WriteLine("Headers: " + response?.Headers.Aggregate("", (acc, h) => acc + "\n\t" + h.Key + ": " + h.Value) ?? "");
            Console.WriteLine("Body: " + await response?.Content.ReadAsStringAsync() ?? "");
        }
    }
}