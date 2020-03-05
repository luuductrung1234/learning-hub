using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ECommerce.API.Model;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<ApiProduct>> GetAsync()
        {
            return new[] { new ApiProduct { } };
        }

        // POST api/values
        [HttpPost]
        public async Task Post()
        {
        }
    }
}
