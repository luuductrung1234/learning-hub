namespace LoyaltyProgramService.Models
{
    public class LoyaltyProgramUser
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int LoyaltyPoints { get; set; }

        public LoyaltyProgramSettings Settings { get; set; }
    }
}