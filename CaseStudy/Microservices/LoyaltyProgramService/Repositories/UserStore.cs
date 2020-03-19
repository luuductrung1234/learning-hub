using System.Collections.Generic;
using LoyaltyProgramService.Models;

namespace LoyaltyProgramService.Repositories
{
    public class UserStore : IUserStore
    {
        private static IDictionary<int, LoyaltyProgramUser> registeredUsers = 
            new Dictionary<int, LoyaltyProgramUser>();
        public LoyaltyProgramUser AddRegisteredUser(LoyaltyProgramUser user)
        {
            var userId = registeredUsers.Count;
            user.Id = userId;
            registeredUsers.Add(user.Id, user);
            return user;
        }

        public LoyaltyProgramUser GetUser(int userId)
        {
            if(registeredUsers.ContainsKey(userId))
                return registeredUsers[userId];
            else
                return null;
        }

        public LoyaltyProgramUser UpdateRegisteredUser(LoyaltyProgramUser user)
        {
            if(registeredUsers.ContainsKey(user.Id))
                return registeredUsers[user.Id] = user;
            else
                return null;
        }
    }
}