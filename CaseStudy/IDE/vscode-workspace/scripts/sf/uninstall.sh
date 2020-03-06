#!/bin/bash -x

sfctl application delete --application-id ECommerce.ProductCatalog
sfctl application unprovision --application-type-name ECommerce.ProductCatalogType --application-type-version 1.0.0
sfctl store delete --content-path ECommerce.ProductCatalog