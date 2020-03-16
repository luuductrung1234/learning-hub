
namespace ShoppingCartService.ShoppingCart
{
    using System.Collections.Generic;

    public class ShoppingCartStore : IShoppingCartStore
    {
        private static readonly Dictionary<int, ShoppingCart> database = new Dictionary<int, ShoppingCart>();

        public ShoppingCart Get(int userId)
        {
            if (!database.ContainsKey(userId))
            {
                database[userId] = new ShoppingCart(userId);
            }

            return database[userId];
        }

        public void Save(ShoppingCart shoppingCart)
        {
            // TODO: need to implement
        }
    }
}