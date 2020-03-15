namespace ShoppingCartService.ShoppingCart
{
    public class Item
    {
        public int ProductItemCode { get; }

        public string ProductItemName { get; }

        public int ProductUnitCode { get; }

        public string ProductUnitName { get; }

        public string Description { get; }

        public ItemPrice Price { get; }

        public Item(
            int productItemCode,
            string productItemName,
            int productUnitCode,
            string productUnitName,
            string description,
            ItemPrice price)
        {
            ProductItemCode = productItemCode;
            ProductItemName = productItemName;
            ProductUnitCode = productUnitCode;
            ProductUnitName = productUnitName;
            Description = description;
            Price = price;
        }


        // override object.Equals
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            var that = obj as Item;
            return this.ProductItemCode.Equals(that.ProductItemCode) && this.ProductUnitCode.Equals(that.ProductUnitCode);
        }

        // override object.GetHashCode
        public override int GetHashCode()
        {
            return this.ProductItemCode.GetHashCode() + this.ProductUnitCode.GetHashCode();
        }
    }
}