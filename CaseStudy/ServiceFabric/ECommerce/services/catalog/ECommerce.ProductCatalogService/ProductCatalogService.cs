using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.ProductCatalog.Infrastructure;
using ECommerce.ProductCatalog.Interfaces;
using ECommerce.ProductCatalog.Model;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.V2.FabricTransport.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

namespace ECommerce.ProductCatalogService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class ProductCatalogService : StatefulService, IProductCatalogService
    {
        private IProductRepository _productRepository;

        public ProductCatalogService(StatefulServiceContext context)
            : base(context)
        { }

        #region Setup Methods

        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new[]
            {
                new ServiceReplicaListener(context =>
                    new FabricTransportServiceRemotingListener(context, this))
            };
        }

        /// <summary>
        /// This is the main entry point for your service replica.
        /// This method executes when this replica of your service becomes primary and has write status.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service replica.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            _productRepository = new ServiceFabricProductRepository(this.StateManager);

            var products = new List<Product>()
            {
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Product 1",
                    Description = "description 1",
                    Price = 10,
                    Availability = 10
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Product 2",
                    Description = "description 2",
                    Price = 15,
                    Availability = 230
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Product 3",
                    Description = "description 3",
                    Price = 50,
                    Availability = 40
                }
            };

            await _productRepository.AddProduct(products[0]);
            await _productRepository.AddProduct(products[1]);
            await _productRepository.AddProduct(products[2]);

            IEnumerable<Product> all = await _productRepository.GetAllProducts();
        }

        #endregion

        #region Business Methods

        public async Task AddProductAsync(Product product)
        {
            await _productRepository.AddProduct(product);
        }

        public async Task<Product[]> GetAllProductsAsync()
        {
            // tranforms a IEnumerable to array
            // Service Fabric remoting doesn't understand IEnumberable 
            // because it need to transfer the results over the network
            //  - Interfaces can not be serialized.
            //  - All the types involved in methods that are called over the network must be simple types (e.g. array).
            return (await _productRepository.GetAllProducts()).ToArray();
        }

        #endregion
    }
}
