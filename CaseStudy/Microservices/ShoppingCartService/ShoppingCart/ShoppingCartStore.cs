namespace ShoppingCartService.ShoppingCart
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ShoppingCartService.ShoppingCart.Configurations;

    public class ShoppingCartStore : IShoppingCartStore
    {
        private static readonly Dictionary<int, ShoppingCart> database = new Dictionary<int, ShoppingCart>();

        public ShoppingCartStore(ShoppingCartStoreConfig config)
        {

        }

        public async Task<ShoppingCart> Get(int userId)
        {
            if (!database.ContainsKey(userId))
            {
                database[userId] = new ShoppingCart(userId);
            }

            return await Task.FromResult(database[userId]);
        }

        public async Task Save(ShoppingCart shoppingCart)
        {
            // TODO: need to implement
            await Task.CompletedTask;
        }
    }
}