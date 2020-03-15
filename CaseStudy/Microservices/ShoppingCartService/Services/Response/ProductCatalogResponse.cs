using System.Linq;

namespace ShoppingCartService.Services.Response
{
    public class ProductCatalogResponse
    {
        public int ProductItemCode { get; set; }

        public string ProductItemName { get; set; }

        public int DivisionCode { get; set; }

        public string DivisionName { get; set; }

        public int CategoryCode { get; set; }

        public string CategoryName { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public ProductFormatResponse CaseFormat { get; set; }

        public ProductFormatResponse BundleFormat { get; set; }

        public ProductFormatResponse UpcFormat { get; set; }

        public ProductPriceResponse GetCaseFormatPrice()
        {
            return CaseFormat.Prices.First(price => price.PriceGroupCode == 1);
        }

        public ProductPriceResponse GetBundleFormatPrice()
        {
            return BundleFormat.Prices.First(price => price.PriceGroupCode == 1);
        }

        public ProductPriceResponse GetUpcFormatPrice()
        {
            return UpcFormat.Prices.First(price => price.PriceGroupCode == 1);
        }
    }
}