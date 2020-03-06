using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECommerce.API.Model;
using ECommerce.ProductCatalog.Interfaces;
using ECommerce.ProductCatalog.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Client;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private const string URL_PREFIX = "fabric:/";
        private const string APPLICATION_NAME = "ECommerce";
        private const string CATALOG_SERVICE_NAME = "ECommerce.ProductCatalogService";

        private readonly IProductCatalogService _catalogService;

        public ProductsController()
        {
            var proxyFactory = new ServiceProxyFactory(c => new FabricTransportServiceRemotingClientFactory());

            _catalogService = proxyFactory.CreateServiceProxy<IProductCatalogService>(
                new Uri($"{URL_PREFIX}{APPLICATION_NAME}/{CATALOG_SERVICE_NAME}"),
                new ServicePartitionKey(0));  
        }

        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<ApiProduct>> GetAsync()
        {
            IEnumerable<Product> allProducts = await _catalogService.GetAllProductsAsync();

            return allProducts.Select(p => new ApiProduct
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                IsAvailable = p.Availability > 0
            });
        }

        // POST api/values
        [HttpPost]
        public async Task Post([FromBody] ApiProduct product)
        {
            var newProduct = new Product()
            {
                Id = Guid.NewGuid(),
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Availability = 0
            };

            await _catalogService.AddProductAsync(newProduct);
        }
    }
}
