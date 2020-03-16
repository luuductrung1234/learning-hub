namespace ShoppingCartService.ShoppingCart
{
    public class ItemPrice
    {
        public string Currency { get; }

        public decimal Amount { get; }

        public ItemPrice(string currency, decimal amount)
        {
            Currency = currency;
            Amount = amount;
        }
    }
}