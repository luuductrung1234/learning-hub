namespace ShoppingCartService.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Polly;
    using ShoppingCartService.Services.Response;
    using ShoppingCartService.ShoppingCart;
    public class ProductCatalogClient : IProductCatalogClient
    {
        private static string productCatalogBaseUrl = @"https://private-bd47bd-trungluu97.apiary-mock.com";
        private static string getProductPathTemplate = "/products?productItemCodes=[{0}]";

        private static IAsyncPolicy exponentialRetryPolicy = 
            Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    3,
                    attemp => TimeSpan.FromMilliseconds(100 * Math.Pow(2, attemp)),
                    (ex, _) => Console.WriteLine(ex.ToString())
                );

        public Task<IEnumerable<Item>> GetShoppingCartItems(int[] productItemCodes) =>
            exponentialRetryPolicy
                .ExecuteAsync(async() => 
                    await GetItemFromProductCatalogService(productItemCodes)
                        .ConfigureAwait(false));

        private async Task<IEnumerable<Item>> GetItemFromProductCatalogService(int[] productItemCodes)
        {
            var response = await
                RequestProductFromApi(productItemCodes)
                .ConfigureAwait(false);
            return await ConvertToItems(response)
                .ConfigureAwait(false);
        }

        private static async Task<HttpResponseMessage> RequestProductFromApi(int[] productItemCodes)
        {
            var productsResource = string.Format(
                getProductPathTemplate, string.Join(",", productItemCodes));

            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new System.Uri(productCatalogBaseUrl);
                return await httpClient.GetAsync(productsResource).ConfigureAwait(false);
            }
        }

        private static async Task<IEnumerable<Item>> ConvertToItems(HttpResponseMessage response)
        {
            response.EnsureSuccessStatusCode();
            var products = JsonConvert.DeserializeObject<List<ProductCatalogResponse>>(
                await response.Content.ReadAsStringAsync().ConfigureAwait(false));
            return products.Select(p =>
            {
                var caseUnit = p.CaseFormat.Unit;
                var casePrice = p.GetCaseFormatPrice();
                var bundleUnit = p.BundleFormat.Unit;
                var bundlePrice = p.GetBundleFormatPrice();
                var upcUnit = p.UpcFormat.Unit;
                var upcPrice = p.GetUpcFormatPrice();
                var caseFormat = new ItemFormat(
                        new ItemUnit(caseUnit.UnitCode,
                            caseUnit.UnitName,
                            caseUnit.Conversion),
                        new ItemPrice(casePrice.Currency, casePrice.Amount)
                    );
                var bundleFormat = new ItemFormat(
                        new ItemUnit(bundleUnit.UnitCode,
                            bundleUnit.UnitName,
                            bundleUnit.Conversion),
                        new ItemPrice(bundlePrice.Currency, bundlePrice.Amount)
                    );
                var upcFormat = new ItemFormat(
                        new ItemUnit(upcUnit.UnitCode,
                            upcUnit.UnitName,
                            upcUnit.Conversion),
                        new ItemPrice(upcPrice.Currency, upcPrice.Amount)
                    );
                int defaultSelectedUnitCode = caseFormat.Unit.UnitCode;
                return new Item(p.ProductItemCode,
                    p.ProductItemName,
                    defaultSelectedUnitCode,
                    p.Description, caseFormat, bundleFormat, upcFormat);
            });
        }
    }
}