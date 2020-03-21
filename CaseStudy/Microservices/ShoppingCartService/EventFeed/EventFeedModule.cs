namespace ShoppingCartService.EventFeed
{
    using System;
    using System.Threading.Tasks;
    using Nancy;

    public class EventFeedModule : NancyModule
    {
        private readonly IEventStore _eventStore;

        public EventFeedModule(IEventStore eventStore) : base("/events")
        {
            _eventStore = eventStore ?? throw new ArgumentNullException(nameof(eventStore));

            SetupGetEvents();
        }

        private void SetupGetEvents() =>
            Get("/", async (parameters, _) =>
            {
                long firstEventSequenceNumber, lastEventSequenceNumber;
                if (!long.TryParse(this.Request.Query.start.Value, out firstEventSequenceNumber))
                {
                    firstEventSequenceNumber = 0;
                }
                if (!long.TryParse(this.Request.Query.end.Value, out lastEventSequenceNumber))
                {
                    lastEventSequenceNumber = long.MaxValue;
                }
                var events = await _eventStore.GetEvents(firstEventSequenceNumber, lastEventSequenceNumber);
                return events;
            });
    }
}