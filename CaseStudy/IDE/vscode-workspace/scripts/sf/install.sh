#!/bin/bash
uninstall () {
    echo "Uninstalling App as installation failed... Please try installation again."
    ./uninstall.sh
    exit
}

cd `dirname $0`
sfctl application upload --path ECommerce.ProductCatalog --show-progress
if [ $? -ne 0 ]; then
  uninstall
fi

sfctl application provision --application-type-build-path ECommerce.ProductCatalog
if [ $? -ne 0 ]; then
  uninstall
fi

sfctl application create --app-name fabric:/ECommerce.ProductCatalog --app-type ECommerce.ProductCatalogType --app-version 1.0.0
if [ $? -ne 0 ]; then
  uninstall
fi

cd -