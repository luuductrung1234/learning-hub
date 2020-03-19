namespace LoyaltyProgramService.Repositories
{
    using LoyaltyProgramService.Models;

    public interface IUserStore
    {
        LoyaltyProgramUser GetUser(int userId);

        LoyaltyProgramUser AddRegisteredUser(LoyaltyProgramUser user);

        LoyaltyProgramUser UpdateRegisteredUser(LoyaltyProgramUser user);
    }
}