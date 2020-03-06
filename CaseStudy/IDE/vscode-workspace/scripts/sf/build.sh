#!/bin/bash
DIR=`dirname $0`
source $DIR/dotnet-include.sh

dotnet restore $DIR/../ECommerce.ProductCatalog/src/ECommerce.ProductCatalog/ProductCatalogService/ProductCatalogService.csproj -s https://api.nuget.org/v3/index.json
dotnet build $DIR/../ECommerce.ProductCatalog/src/ECommerce.ProductCatalog/ProductCatalogService/ProductCatalogService.csproj -v normal

cd `dirname $DIR/../ECommerce.ProductCatalog/src/ECommerce.ProductCatalog/ProductCatalogService/ProductCatalogService.csproj`
dotnet publish -o ../../../../ECommerce.ProductCatalog/ECommerce.ProductCatalog/ProductCatalogServicePkg/Code
cd -
