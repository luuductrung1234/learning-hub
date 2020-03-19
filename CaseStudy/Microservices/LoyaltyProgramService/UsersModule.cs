namespace LoyaltyProgramService
{
    using System;
    using LoyaltyProgramService.Models;
    using LoyaltyProgramService.Repositories;
    using Nancy;
    using Nancy.ModelBinding;

    public class UsersModule : NancyModule
    {
        private readonly IUserStore _userStore;

        public UsersModule(IUserStore userStore)
        {
            this._userStore = userStore ?? throw new ArgumentNullException(nameof(userStore));

            SetupGetUser();
            SetupAddRegisteredUser();
            SetupUpdateUser();
        }

        private void SetupGetUser() => Get("/{userId:int}", parameters =>
        {
            int userId = parameters.userId;
            var user = _userStore.GetUser(userId);
            if (user is null)
                return HttpStatusCode.NotFound;
            return user;
        });

        private void SetupAddRegisteredUser() => Post("/", _ =>
        {
            var newUser = this.Bind<LoyaltyProgramUser>();
            var createdUser = _userStore.AddRegisteredUser(newUser);
            return this.CreatedResponse(createdUser);
        });

        private void SetupUpdateUser() => Put("/{userId:int}", parameters =>
        {
            var userId = parameters.userId;
            var userToUpdate = this.Bind<LoyaltyProgramUser>();
            var updatedUser = _userStore.UpdateRegisteredUser(userToUpdate);
            return updatedUser;
        });

        private dynamic CreatedResponse(LoyaltyProgramUser createdUser)
        {
            return
                this.Negotiate
                    .WithStatusCode(HttpStatusCode.Created)
                    .WithHeader("Location", this.Request.Url.SiteBase + "/users/" + createdUser.Id)
                    .WithModel(createdUser);
        }
    }
}