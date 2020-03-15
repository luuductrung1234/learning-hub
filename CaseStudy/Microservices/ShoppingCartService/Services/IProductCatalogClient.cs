
namespace ShoppingCartService.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ShoppingCartService.ShoppingCart;

    public interface IProductCatalogClient
    {
        Task<IEnumerable<Item>> GetShoppingCartItems(int[] productItemCodes);
    }
}