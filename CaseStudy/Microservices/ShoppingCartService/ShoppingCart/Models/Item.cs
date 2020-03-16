namespace ShoppingCartService.ShoppingCart
{
    using System.Collections.Generic;
    using System.Linq;

    public class Item
    {
        public int ProductItemCode { get; }

        public string ProductItemName { get; }

        public int SelectedUnitCode { get; }

        public int Quantity { get; private set; }

        public ItemFormat Format { get; }

        public string Description { get; }

        public Item(int productItemCode, string productItemName, int selectedUnitCode, int quantity, ItemFormat format, string description)
        {
            ProductItemCode = productItemCode;
            ProductItemName = productItemName;
            SelectedUnitCode = selectedUnitCode;
            Quantity = quantity;
            Description = description;
            Format = format;
        }

        public void SetQuantity(int quantity)
        {
            Quantity = quantity;
        }

        // override object.Equals
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            var that = obj as Item;
            return this.ProductItemCode.Equals(that.ProductItemCode)
                && this.SelectedUnitCode.Equals(that.SelectedUnitCode);
        }

        // override object.GetHashCode
        public override int GetHashCode()
        {
            return this.ProductItemCode.GetHashCode() + this.SelectedUnitCode.GetHashCode();
        }
    }
}