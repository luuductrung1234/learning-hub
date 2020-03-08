module.exports = {
    generateApplicationManifest: function(
        appPackagePath,
        appTypeName,
        serviceName,
        servicePackageName,
        serviceTypeName
    ) {
        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath(
                    "service/app/appPackage/ApplicationManifest.xml"
                ),
                this.destinationPath(
                    path.join(appPackagePath, "ApplicationManifest.xml")
                ),
                {
                    appTypeName: appTypeName,
                    servicePackage: servicePackageName,
                    serviceName: serviceName,
                    serviceTypeName: serviceTypeName
                }
            );
        } else {
            var fs = require("fs");
            var xml2js = require("xml2js");
            var parser = new xml2js.Parser();
            fs.readFile(
                path.join(appPackagePath, "ApplicationManifest.xml"),
                function(err, data) {
                    parser.parseString(data, function(err, result) {
                        if (err) {
                            return this._logError(err);
                        }

                        var parameterCount = result["ApplicationManifest"]["Parameters"][0]["Parameter"].length;

                        result["ApplicationManifest"]["Parameters"][0]["Parameter"][parameterCount] = {
                            $: {
                                Name = serviceName + "_ASPNETCORE_ENVIRONMENT",
                                DefaultValue = ""
                            }
                        };

                        parameterCount++;

                        result["ApplicationManifest"]["Parameters"][0]["Parameter"][parameterCount] = {
                            $: {
                                Name = serviceName + "_InstanceCount",
                                DefaultValue = "-1"
                            }
                        };

                        var serviceManifestImportCount = result["ApplicationManifest"]["ServiceManifestImport"].length;

                        result["ApplicationManifest"]["ServiceManifestImport"][serviceManifestImportCount] = {
                            ServiceManifestRef: [
                                {
                                    $: {
                                        ServiceManifestName: servicePackageName,
                                        ServiceManifestVersion: "1.0.0"
                                    },
                                    ConfigOverrides: [""],
                                    EnvironmentOverrides: [
                                        {
                                            $: {
                                                CodePackageRef= "code"
                                            },
                                            EnvironmentVariable: [
                                                {
                                                    $: {
                                                        Name= "ASPNETCORE_ENVIRONMENT",
                                                        Value= "[" + serviceName + "_ASPNETCORE_ENVIRONMENT" +"]"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };

                        var defaultServiceCount = result["ApplicationManifest"]["DefaultServices"][0]["Service"].length;

                        result["ApplicationManifest"]["DefaultServices"][0]["Service"][defaultServiceCount] = {
                            $: { 
                                Name: serviceName,
                                ServicePackageActivationMode= "ExclusiveProcess"
                            },
                            StatelessService: [
                                {
                                    $: {
                                        ServiceTypeName: serviceTypeName,
                                        InstanceCount: "[" + serviceName + "_InstanceCount" + "]"
                                    },
                                    SingletonPartition: {}
                                }
                            ]
                        };

                        var builder = new xml2js.Builder();
                        var xml = builder.buildObject(result);
                        fs.writeFile(
                            path.join(
                                appPackagePath,
                                "ApplicationManifest.xml"
                            ),
                            xml,
                            function(err) {
                                if (err) {
                                    return this._logError(err);
                                }
                            }
                        );
                    });
                }
            );
        }
    },

    generateApplicationParameters: function(appParametersPath, serviceName) {
        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath("service/app/appPackage/Cloud.xml"),
                this.destinationPath(path.join(appParametersPath, "Cloud.xml")),
                {
                    serviceName: serviceName
                }
            );

            this.fs.copyTpl(
                this.templatePath("service/app/appPackage/Local.1Node.xml"),
                this.destinationPath(
                    path.join(appParametersPath, "Local.1Node.xml")
                ),
                {
                    serviceName: serviceName
                }
            );

            this.fs.copyTpl(
                this.templatePath("service/app/appPackage/Local.5Node.xml"),
                this.destinationPath(
                    path.join(appParametersPath, "Local.5Node.xml")
                ),
                {
                    serviceName: serviceName
                }
            );
        } else {
            var fs = require("fs");
            var xml2js = require("xml2js");
            var parser = new xml2js.Parser();

            fs.readFile(path.join(appParametersPath, "Cloud.xml"), function(
                err,
                data
            ) {
                parser.parseString(data, function(err, result) {
                    if (err) {
                        return this._logError(err);
                    }
                    
                    var parameterCount = result["Application"]["Parameters"][0]["Parameter"].length;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_ASPNETCORE_ENVIRONMENT",
                            Value= "Development"
                        }
                    }

                    parameterCount++;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_InstanceCount",
                            Value= "-1"
                        }
                    }

                    var builder = new xml2js.Builder();
                    var xml = builder.buildObject(result);
                    fs.writeFile(
                        path.join(appParametersPath, "Cloud.xml"),
                        xml,
                        function(err) {
                            if (err) {
                                return this._logError(err);
                            }
                        }
                    );
                });
            });

            fs.readFile(path.join(appParametersPath, "Local.1Node.xml"), function(
                err,
                data
            ) {
                parser.parseString(data, function(err, result) {
                    if (err) {
                        return this._logError(err);
                    }
                    
                    var parameterCount = result["Application"]["Parameters"][0]["Parameter"].length;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_ASPNETCORE_ENVIRONMENT",
                            Value= "Local"
                        }
                    }

                    parameterCount++;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_InstanceCount",
                            Value= "1"
                        }
                    }

                    var builder = new xml2js.Builder();
                    var xml = builder.buildObject(result);
                    fs.writeFile(
                        path.join(appParametersPath, "Local.1Node.xml"),
                        xml,
                        function(err) {
                            if (err) {
                                return this._logError(err);
                            }
                        }
                    );
                });
            });
            
            fs.readFile(path.join(appParametersPath, "Local.5Node.xml"), function(
                err,
                data
            ) {
                parser.parseString(data, function(err, result) {
                    if (err) {
                        return this._logError(err);
                    }
                    
                    var parameterCount = result["Application"]["Parameters"][0]["Parameter"].length;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_ASPNETCORE_ENVIRONMENT",
                            Value= "Local"
                        }
                    }

                    parameterCount++;

                    result["Application"]["Parameters"][0]["Parameter"][parameterCount] = {
                        $: {
                            Name= serviceName + "_InstanceCount",
                            Value= "1"
                        }
                    }

                    var builder = new xml2js.Builder();
                    var xml = builder.buildObject(result);
                    fs.writeFile(
                        path.join(appParametersPath, "Local.5Node.xml"),
                        xml,
                        function(err) {
                            if (err) {
                                return this._logError(err);
                            }
                        }
                    );
                });
            });

        }
    },

    generateServiceManifest: function(
        servicePackagePath,
        serviceName,
        serviceProjName,
        servicePackageName,
        serviceTypeName,
        endpoint
    ) {
        var is_Windows = process.platform == "win32";
        var is_Linux = process.platform == "linux";
        var is_mac = process.platform == "darwin";

        var serviceManifestFile;
        if (is_Windows) {
            serviceManifestFile = "ServiceManifest.xml";
        }
        if (is_Linux) serviceManifestFile = "ServiceManifest_Linux.xml";
        if (is_mac) serviceManifestFile = "ServiceManifest.xml";

        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/" + serviceManifestFile
            ),
            this.destinationPath(
                path.join(servicePackagePath, "ServiceManifest.xml")
            ),
            {
                servicePackage: servicePackageName,
                serviceTypeName: serviceTypeName,
                serviceName: serviceName,
                serviceProjName: serviceProjName,
                endpoint: endpoint
            }
        );
    }
};
