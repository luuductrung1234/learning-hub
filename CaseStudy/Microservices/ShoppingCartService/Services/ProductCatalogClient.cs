
namespace ShoppingCartService.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ShoppingCartService.ShoppingCart;
    public class ProductCatalogClient : IProductCatalogClient
    {
        public Task<IEnumerable<Item>> GetShoppingCartItems(IEnumerable<int> productItemCodes)
        {
            throw new System.NotImplementedException();
        }
    }
}