
namespace ApiGatewayMock.Services.LoyaltyProgram
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Polly;

    public class LoyaltyProgramClient : ILoyaltyProgramClient
    {
        private static IAsyncPolicy exponentialRetryPolicy =
            Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    3,
                    attempt => TimeSpan.FromMilliseconds(100 * Math.Pow(2, attempt)),
                    (_, __) => Console.WriteLine("retrying..." + _)
                );

        private string hostName;

        public LoyaltyProgramClient(string loyalProgramMicroserviceHostName)
        {
            this.hostName = loyalProgramMicroserviceHostName;
        }

        public async Task<HttpResponseMessage> QueryUser(int userId)
        {
            return await exponentialRetryPolicy.ExecuteAsync(async () =>
            {
                var userResource = $"/users/{userId}";
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.BaseAddress = new Uri($"http://{this.hostName}");
                    var response = await httpClient.GetAsync(userResource);
                    ThrowOnTransientFailure(response);
                    return response;
                }
            });
        }

        public async Task<HttpResponseMessage> RegisterUser(LoyaltyProgramUser user)
        {
            return await exponentialRetryPolicy.ExecuteAsync(async () =>
            {
                var userResource = "/users/";
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.BaseAddress = new Uri($"http://{this.hostName}");
                    var response = await httpClient.PostAsync(
                        userResource,
                        new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json"),
                        CancellationToken.None);
                    ThrowOnTransientFailure(response);
                    return response;
                }
            });
        }

        public async Task<HttpResponseMessage> UpdateUser(LoyaltyProgramUser user)
        {
            return await exponentialRetryPolicy.ExecuteAsync(async () =>
            {
                var userResource = $"/users/{user.Id}";
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.BaseAddress = new Uri($"http://{this.hostName}");
                    var response = await httpClient.PutAsync(
                        userResource,
                        new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json"),
                        CancellationToken.None);
                    ThrowOnTransientFailure(response);
                    return response;
                }
            });
        }

        private static void ThrowOnTransientFailure(HttpResponseMessage response)
        {
            if (((int)response.StatusCode) < 200 || ((int)response.StatusCode > 499))
                throw new Exception(response.StatusCode.ToString());
        }
    }
}