namespace ShoppingCartService.EventFeed
{
    using System;

    public class Event
    {
        public long SequenceNumber { get; set; }

        public DateTimeOffset OccuredAt { get; set; }

        public string Name { get; set; }

        public object Content { get; set; }

        public Event(
            long sequenceNumber,
            DateTimeOffset occuredAt,
            string name,
            object content)
        {
            SequenceNumber = sequenceNumber;
            OccuredAt = occuredAt;
            Name = name;
            Content = content;
        }
    }
}