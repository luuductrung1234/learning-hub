#!/bin/bash

sfctl application delete --application-id SalesHUB.ProductService.SFHost
sfctl application unprovision --application-type-name SalesHUB.ProductService.SFHostType --application-type-version 1.0.0
sfctl store delete --content-path SalesHUB.ProductService.SFHost
