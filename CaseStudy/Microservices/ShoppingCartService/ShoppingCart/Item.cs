namespace ShoppingCartService.ShoppingCart
{
    using System.Collections.Generic;
    using System.Linq;

    public class Item
    {
        public int ProductItemCode { get; }

        public string ProductItemName { get; }

        public int SelectedUnitCode { get; private set; }

        public string Description { get; }

        public ItemFormat CaseFormat { get; }

        public ItemFormat BundleFormat { get; }

        public ItemFormat UpcFormat { get; }

        public Item(int productItemCode, string productItemName, int selectedUnitCode, string description, ItemFormat caseFormat, ItemFormat bundleFormat, ItemFormat upcFormat)
        {
            ProductItemCode = productItemCode;
            ProductItemName = productItemName;
            SelectedUnitCode = selectedUnitCode;
            Description = description;
            CaseFormat = caseFormat;
            BundleFormat = bundleFormat;
            UpcFormat = upcFormat;
        }

        public void SelectUnit(int unitCode)
        {
            if (CaseFormat.Unit.UnitCode == unitCode
                || BundleFormat.Unit.UnitCode == unitCode
                || UpcFormat.Unit.UnitCode == unitCode)
            {
                SelectedUnitCode = unitCode;
            }
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