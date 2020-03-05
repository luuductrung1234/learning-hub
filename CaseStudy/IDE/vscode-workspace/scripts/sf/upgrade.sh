#!/bin/bash
cd `dirname $0`
sfctl application upload --path ECommerce.ProductCatalog --show-progress
sfctl application provision --application-type-build-path ECommerce.ProductCatalog
sfctl application upgrade --app-id fabric:/ECommerce.ProductCatalog --app-version $1 --parameters "{}" --mode Monitored
cd -