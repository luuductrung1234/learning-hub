namespace ShoppingCartService.ShoppingCart
{
    public class ItemUnit
    {
        public int UnitCode { get; set; }

        public string UnitName { get; set; }

        public int Conversion { get; set; }

        public ItemUnit(int unitCode, string unitName, int conversion)
        {
            UnitCode = unitCode;
            UnitName = unitName;
            Conversion = conversion;
        }
    }
}