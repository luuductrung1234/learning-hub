namespace ShoppingCartService.Services.Response
{
    public class ProductPriceResponse
    {
        public int PriceCode { get; set; }

        public string PriceName { get; set; }

        public int PriceGroupCode { get; set; }

        public string PriceGroupName { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; }
    }
}