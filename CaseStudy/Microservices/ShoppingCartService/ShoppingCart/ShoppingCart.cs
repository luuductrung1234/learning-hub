namespace ShoppingCartService.ShoppingCart
{
    using System.Collections.Generic;
    using System.Linq;
    using ShoppingCartService.EventFeed;

    public class ShoppingCart
    {
        private HashSet<Item> items = new HashSet<Item>();

        public int UserId { get; set; }
        public IEnumerable<Item> Items { get { return items; } }

        public ShoppingCart(int userId)
        {
            UserId = userId;
        }

        public void AddItems(IEnumerable<Item> items, IEventStore eventStore)
        {
            foreach (var item in items)
            {
                if (this.items.Add(item))
                {
                    eventStore.Raise("ShoppingCartItemAdded", new { UserId, item });
                }
            }
        }

        public void RemoveItems(int[] productItemCodes, IEventStore eventStore)
        {
            this.items.RemoveWhere(i => productItemCodes.Contains(i.ProductItemCode));
        }
    }
}