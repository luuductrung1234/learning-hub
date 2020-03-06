using ECommerce.ProductCatalog.Model;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.ProductCatalog.Interfaces
{
    public interface IProductCatalogService : IService
    {
        Task<Product[]> GetAllProductsAsync();

        Task AddProductAsync(Product product);
    }
}
