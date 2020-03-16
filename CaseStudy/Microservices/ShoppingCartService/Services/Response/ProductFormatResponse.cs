using System.Linq;

namespace ShoppingCartService.Services.Response
{
    public class ProductFormatResponse
    {
        public int FormatCode { get; set; }

        public string FormatName { get; set; }

        public ProductUnitResponse Unit { get; set; }

        public ProductPriceResponse[] Prices { get; set; }

        public ProductPriceResponse GetRetailerPrice()
        {
            return Prices.First(p => p.PriceGroupCode == 1);
        }
    }
}