
namespace ShoppingCartService.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ShoppingCartService.ShoppingCart;
    using ShoppingCartService.ShoppingCart.MetaModels;

    public interface IProductCatalogClient
    {
        Task<IEnumerable<Item>> GetShoppingCartItems(AddItem[] addItems);
    }
}