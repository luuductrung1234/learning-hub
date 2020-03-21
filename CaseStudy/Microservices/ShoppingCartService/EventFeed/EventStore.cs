namespace ShoppingCartService.EventFeed
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using ShoppingCartService.EventFeed.Configurations;

    public class EventStore : IEventStore
    {
        private static long currentSequenceNumber = 0;
        private static readonly IList<Event> database = new List<Event>();

        public EventStore(EventStoreConfig config)
        {

        }

        public async Task<IEnumerable<Event>> GetEvents(
            long firstEventSequenceNumber,
            long lastEventSequenceNumber)
            => await Task.FromResult(database
                .Where(e =>
                    e.SequenceNumber >= firstEventSequenceNumber
                    && e.SequenceNumber <= lastEventSequenceNumber)
                .OrderBy(e => e.SequenceNumber));

        public async Task Raise(string eventName, object content)
        {
            var sequenceNumber = Interlocked.Increment(ref currentSequenceNumber);
            database.Add(new Event(
                sequenceNumber,
                DateTimeOffset.UtcNow,
                eventName,
                content
            ));
            await Task.CompletedTask;
        }
    }
}