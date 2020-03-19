using System.Net.Http;
using System.Threading.Tasks;

namespace ApiGatewayMock.Services.LoyaltyProgram
{
    public interface ILoyaltyProgramClient
    {
        Task<HttpResponseMessage> QueryUser(int userId);

        Task<HttpResponseMessage> RegisterUser(LoyaltyProgramUser user);

        Task<HttpResponseMessage> UpdateUser(LoyaltyProgramUser user);
    }
}