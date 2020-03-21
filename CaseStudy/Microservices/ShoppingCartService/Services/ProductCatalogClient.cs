namespace ShoppingCartService.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Polly;
    using ShoppingCartService.Services.Configurations;
    using ShoppingCartService.Services.Response;
    using ShoppingCartService.ShoppingCart;
    using ShoppingCartService.ShoppingCart.MetaModels;

    public class ProductCatalogClient : IProductCatalogClient
    {
        private readonly string productCatalogBaseUrl;
        private readonly string getProductPathTemplate = "/products?productItemCodes=[{0}]";

        public ProductCatalogClient(ProductCatalogClientConfig config)
        {
            if (config is null)
                throw new ArgumentNullException(nameof(config));
            productCatalogBaseUrl = config.BaseUrl;
        }

        private static IAsyncPolicy exponentialRetryPolicy =
            Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    3,
                    attemp => TimeSpan.FromMilliseconds(100 * Math.Pow(2, attemp)),
                    (ex, _) => Console.WriteLine(ex.ToString())
                );

        public Task<IEnumerable<Item>> GetShoppingCartItems(AddItem[] addItems) =>
            exponentialRetryPolicy
                .ExecuteAsync(async () =>
                    await GetItemFromProductCatalogService(addItems)
                        .ConfigureAwait(false));

        private async Task<IEnumerable<Item>> GetItemFromProductCatalogService(AddItem[] addItems)
        {
            int[] productItemCodes = addItems.Select(item => item.ProductItemCode).ToArray();
            var response = await
                RequestProductFromApi(productItemCodes)
                .ConfigureAwait(false);
            return await ConvertToItems(response, addItems)
                .ConfigureAwait(false);
        }

        private async Task<HttpResponseMessage> RequestProductFromApi(int[] productItemCodes)
        {
            var productsResource = string.Format(
                getProductPathTemplate, string.Join(",", productItemCodes));

            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new System.Uri(productCatalogBaseUrl);
                return await httpClient.GetAsync(productsResource).ConfigureAwait(false);
            }
        }

        private async Task<IEnumerable<Item>> ConvertToItems(HttpResponseMessage response, AddItem[] addItems)
        {
            response.EnsureSuccessStatusCode();
            var products = JsonConvert.DeserializeObject<List<ProductCatalogResponse>>(
                await response.Content.ReadAsStringAsync().ConfigureAwait(false));
            return products.Select(p =>
            {
                var addItem = addItems.First(item => item.ProductItemCode == p.ProductItemCode);

                var selectedFormat = p.GetFormat(addItem.ProductUnitCode);
                var price = selectedFormat.GetRetailerPrice();
                var format = new ItemFormat(
                    new ItemUnit(
                        selectedFormat.Unit.UnitCode,
                        selectedFormat.Unit.UnitName,
                        selectedFormat.Unit.Conversion),
                    new ItemPrice(price.Currency, price.Amount));
                return new Item(p.ProductItemCode,
                    p.ProductItemName,
                    addItem.ProductItemCode,
                    addItem.Quantity,
                    format,
                    p.Description);
            });
        }
    }
}