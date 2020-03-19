namespace LoyaltyProgramService.Helpers
{
    using System.IO;
    using Nancy.ModelBinding;
    using Nancy.Responses.Negotiation;
    using YamlDotNet.Serialization;

    public class YamlDeserializer : IBodyDeserializer
    {
        public bool CanDeserialize(MediaRange mediaRange, BindingContext context)
            => mediaRange.Subtype.ToString().EndsWith("yaml");

        public object Deserialize(MediaRange mediaRange, Stream bodyStream, BindingContext context)
        {
            var yamlDeserializer = new Deserializer();
            var reader = new StreamReader(bodyStream);
            return yamlDeserializer.Deserialize(reader, context.DestinationType);
        }
    }
}