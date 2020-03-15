namespace ShoppingCartService.EventFeed
{
    using System.Collections.Generic;

    public interface IEventStore
    {
        IEnumerable<Event> GetEvents(long firstEventSequenceNumber, long lastEventSequenceNumber);

        void Raise(string eventName, object payload);
    }
}