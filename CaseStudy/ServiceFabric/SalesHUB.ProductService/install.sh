#!/bin/bash
uninstall () {
    echo "Uninstalling App as installation failed... Please try installation again."
    ./uninstall.sh
    exit
}

cd `dirname $0`
sfctl application upload --path SalesHUB.ProductService.SFHost --show-progress
if [ $? -ne 0 ]; then
  uninstall
fi

sfctl application provision --application-type-build-path SalesHUB.ProductService.SFHost
if [ $? -ne 0 ]; then
  uninstall
fi

sfctl application create --app-name fabric:/SalesHUB.ProductService.SFHost --app-type SalesHUB.ProductService.SFHostType --app-version 1.0.0
if [ $? -ne 0 ]; then
  uninstall
fi

cd -