using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SalesHUB.ProductService.Console
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var client = new HttpClient();
            var response = await client.GetStringAsync("http://172.17.0.2:80/weatherforecast");

            var forecast = JsonConvert.DeserializeObject<List<Weather>>(response);

            System.Console.WriteLine("----- WEATHER FORCAST -----");

            foreach (var weather in forecast)
            {
                System.Console.WriteLine($"Date: {weather.Date}");
                System.Console.WriteLine($"Temp (in C): {weather.TemperatureC}");
                System.Console.WriteLine($"Temp (in F): {weather.TemperatureF}");
                System.Console.WriteLine($"Summary: {weather.Summary}");
                System.Console.WriteLine("---------------------------");
            }
        }
    }

    class Weather
    {
        public DateTime Date { get; set; }

        public double TemperatureC { get; set; }

        public double TemperatureF { get; set; }

        public string Summary { get; set; }
    }
}
