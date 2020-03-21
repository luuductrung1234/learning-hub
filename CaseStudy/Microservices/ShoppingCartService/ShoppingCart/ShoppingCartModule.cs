namespace ShoppingCartService.ShoppingCart
{
    using System;
    using System.Threading.Tasks;
    using Nancy;
    using Nancy.ModelBinding;
    using ShoppingCartService.EventFeed;
    using ShoppingCartService.Services;
    using ShoppingCartService.ShoppingCart.MetaModels;

    public class ShoppingCartModule : NancyModule
    {
        private readonly IShoppingCartStore _shoppingCartStore;
        private readonly IProductCatalogClient _productCatalogClient;
        private readonly IEventStore _eventStore;

        public ShoppingCartModule(
            IShoppingCartStore shoppingCartStore,
            IProductCatalogClient productCatalogClient,
            IEventStore eventStore)
            : base("/shoppingcart")
        {
            _shoppingCartStore = shoppingCartStore ?? throw new ArgumentNullException(nameof(shoppingCartStore));
            _productCatalogClient = productCatalogClient ?? throw new ArgumentNullException(nameof(productCatalogClient));
            _eventStore = eventStore ?? throw new ArgumentNullException(nameof(eventStore));

            SetupGetShoppingCart();
            SetupAddShoppingCartItems();
            SetupRemoveShoppingCartItems();
        }

        private void SetupGetShoppingCart() =>
            Get("/{userId:int}", async (parameters, _) =>
            {
                var userId = (int)parameters.userId;
                var shoppingCart = await _shoppingCartStore.Get(userId);
                return shoppingCart;
            });

        private void SetupAddShoppingCartItems() =>
            Post("/{userId:int}", async (parameters, _) =>
            {
                var userId = (int)parameters.userId;
                var addItems = this.Bind<AddItem[]>();

                var shoppingCart = await _shoppingCartStore.Get(userId);
                var itemsToAdd = await
                    _productCatalogClient
                        .GetShoppingCartItems(addItems)
                        .ConfigureAwait(false);

                shoppingCart.AddItems(itemsToAdd, _eventStore);

                await _shoppingCartStore.Save(shoppingCart);

                return shoppingCart;
            });

        private void SetupRemoveShoppingCartItems() =>
            Delete("/{userId:int}", async (parameters, _) =>
            {
                var userId = (int)parameters.userId;
                var productItemCodes = this.Bind<int[]>();

                var shoppingCart = await _shoppingCartStore.Get(userId);

                shoppingCart.RemoveItems(productItemCodes, _eventStore);

                await _shoppingCartStore.Save(shoppingCart);

                return await Task.FromResult(shoppingCart);
            });
    }
}