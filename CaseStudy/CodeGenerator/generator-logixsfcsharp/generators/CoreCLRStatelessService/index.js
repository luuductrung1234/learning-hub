"use strict";

var Generator = require("yeoman-generator");
var Storage = require("yeoman-generator/lib/util/storage");

var path = require("path");
// var chalk = require("chalk");
// var wiredep = require("wiredep");

var ClassGenerator = class extends Generator {
    SOLUTIONNAME = "solutionname";
    APPNAME = "appname";
    SERVICENAME = "servicename";
    PATH = "path";

    CONTAINER_PATH = "containerPath";
    LIB_PATH = "libPath";
    ADD_NEW_SERVICE = "isAddNewService";
    LOGGING = "logging";

    constructor(args, opts) {
        // Calling the super constructor is import so out generator is correctly setup
        super(args, opts);

        // TODO: Next, add your custom code
        this._generator_options_config();
        this._generator_options_handler();
        this._generator_arguments_config();
        this._generator_arguments_handler();

        this.desc("Generate Service Fabric Stateless Service app template");
    }

    //#region  Sequence Methods

    /**
     * initialization methods (checking current project state, getting configs, etc
     */
    initalizing() {
        this.props = this.config.getAll();
        this.config.defaults({
            authorName: "<your name>"
        });
    }

    /**
     * Where to prompt users for options (where to call this.prompt())
     */
    async prompting() {
        var utility = require("../utility");

        var prompts = this._generator_inquiries();

        await this.prompt(prompts).then(answers => {
            this.relativePath = answers[this.PATH];
            this.serviceName = answers[this.SERVICENAME];

            // this.serviceFQN = answers[this.SERVICENAME];
            // var parts = this.serviceFQN.split(".");
            // var name = parts.pop();
            // this.packageName = parts.join(".");
            // this.dir = parts.join("/");
            // this.serviceName = utility.capitalizeFirstLetter(name.trim());
            // if (!this.packageName) {
            //     this.packageName = "statelessservice";
            //     this.serviceFQN = "statelessservice" + this.serviceFQN;
            //     this.dir = this.dir + "/statelessservice";
            // }
        });
    }

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring() {}

    /**
     * If the method name doesn’t match a priority, it will be pushed to this group.
     */
    default() {}

    /**
     * Where to write the generator specific files (routes, controllers, etc)
     */
    writing() {
        // application variables
        var appName = this.props[this.APPNAME];
        var appProjName = this.props[this.APPNAME];
        var appTypeName = this.props[this.APPNAME] + "Type";
        var appSrcPath = "";
        if (this.isAddNewService == false) {
            appSrcPath = path.join(
                this.props[this.SOLUTIONNAME],
                this.props[this.APPNAME]
            );
        } else {
            appSrcPath = this.props[this.APPNAME];
        }
        var appProjectFileName = path.join(appSrcPath, appProjName + ".sfproj");
        var appPackagePath = path.join(appSrcPath, "ApplicationPackageRoot");
        var appParametersPath = path.join(appSrcPath, "ApplicationParameters");

        // service variables
        var serviceProjName = this.serviceName;
        var servicePackageName = this.serviceName + "Pkg";
        var serviceTypeName = this.serviceName + "Type";
        var serviceName = this.serviceName;
        var serviceSrcPath = "";
        if (this.isAddNewService == false) {
            serviceSrcPath = path.join(
                this.props[this.SOLUTIONNAME],
                this.relativePath,
                this.serviceName
            );
        } else {
            serviceSrcPath = path.join(this.relativePath, this.serviceName);
        }
        var serviceProjectFileName = path.join(
            serviceSrcPath,
            serviceProjName + ".csproj"
        );
        var servicePackagePath = path.join(serviceSrcPath, "PackageRoot");
        var endpoint = Math.floor(Math.random() * 1000) + 8000;
        var parts = this.serviceName.split(".");
        var serviceMainClass = parts.pop();

        this._generateApplicationManifest(
            appPackagePath,
            appTypeName,
            serviceName,
            servicePackageName,
            serviceTypeName
        );

        this._generateApplicationParameters(appParametersPath, serviceName);

        this._generateServiceManifest(
            servicePackagePath,
            serviceName,
            serviceProjName,
            servicePackageName,
            serviceTypeName,
            endpoint
        );

        this._generateContent(
            appName,
            serviceSrcPath,
            servicePackagePath,
            serviceName,
            serviceTypeName,
            serviceMainClass
        );
    }

    /**
     * Where conflicts are handled (used internally)
     */
    conflicts() {}

    /**
     * Where installations are run (npm, bower)
     */
    install() {}

    /**
     * Called last, cleanup, say good bye, etc
     */
    end() {}

    //#endregion

    //#region Business Methods

    _generateApplicationManifest(
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
            this.log(appPackagePath);
            var fs = require("fs");
            var xml2js = require("xml2js");
            var parser = new xml2js.Parser();
            fs.readFile(
                path.join(appPackagePath, "ApplicationManifest.xml"),
                function(err, data) {
                    parser.parseString(data, function(err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        var parameterCount =
                            result["ApplicationManifest"]["Parameters"][0][
                                "Parameter"
                            ].length;

                        result["ApplicationManifest"]["Parameters"][0][
                            "Parameter"
                        ][parameterCount] = {
                            $: {
                                Name: serviceName + "_ASPNETCORE_ENVIRONMENT",
                                DefaultValue: ""
                            }
                        };

                        parameterCount++;

                        result["ApplicationManifest"]["Parameters"][0][
                            "Parameter"
                        ][parameterCount] = {
                            $: {
                                Name: serviceName + "_InstanceCount",
                                DefaultValue: "-1"
                            }
                        };

                        var serviceManifestImportCount =
                            result["ApplicationManifest"][
                                "ServiceManifestImport"
                            ].length;

                        result["ApplicationManifest"]["ServiceManifestImport"][
                            serviceManifestImportCount
                        ] = {
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
                                                CodePackageRef: "code"
                                            },
                                            EnvironmentVariable: [
                                                {
                                                    $: {
                                                        Name:
                                                            "ASPNETCORE_ENVIRONMENT",
                                                        Value:
                                                            "[" +
                                                            serviceName +
                                                            "_ASPNETCORE_ENVIRONMENT" +
                                                            "]"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };

                        var defaultServiceCount =
                            result["ApplicationManifest"]["DefaultServices"][0][
                                "Service"
                            ].length;

                        result["ApplicationManifest"]["DefaultServices"][0][
                            "Service"
                        ][defaultServiceCount] = {
                            $: {
                                Name: serviceName,
                                ServicePackageActivationMode: "ExclusiveProcess"
                            },
                            StatelessService: [
                                {
                                    $: {
                                        ServiceTypeName: serviceTypeName,
                                        InstanceCount:
                                            "[" +
                                            serviceName +
                                            "_InstanceCount" +
                                            "]"
                                    },
                                    SingletonPartition: [""]
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
                                    return console.log(err);
                                }
                            }
                        );
                    });
                }
            );
        }
    }

    _generateApplicationParameters(appParametersPath, serviceName) {
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
                        return console.log(err);
                    }

                    var parameterCount =
                        result["Application"]["Parameters"][0]["Parameter"]
                            .length;

                    result["Application"]["Parameters"][0]["Parameter"][
                        parameterCount
                    ] = {
                        $: {
                            Name: serviceName + "_ASPNETCORE_ENVIRONMENT",
                            Value: "Development"
                        }
                    };

                    parameterCount++;

                    result["Application"]["Parameters"][0]["Parameter"][
                        parameterCount
                    ] = {
                        $: {
                            Name: serviceName + "_InstanceCount",
                            Value: "-1"
                        }
                    };

                    var builder = new xml2js.Builder();
                    var xml = builder.buildObject(result);
                    fs.writeFile(
                        path.join(appParametersPath, "Cloud.xml"),
                        xml,
                        function(err) {
                            if (err) {
                                return console.log(err);
                            }
                        }
                    );
                });
            });

            fs.readFile(
                path.join(appParametersPath, "Local.1Node.xml"),
                function(err, data) {
                    parser.parseString(data, function(err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        var parameterCount =
                            result["Application"]["Parameters"][0]["Parameter"]
                                .length;

                        result["Application"]["Parameters"][0]["Parameter"][
                            parameterCount
                        ] = {
                            $: {
                                Name: serviceName + "_ASPNETCORE_ENVIRONMENT",
                                Value: "Local"
                            }
                        };

                        parameterCount++;

                        result["Application"]["Parameters"][0]["Parameter"][
                            parameterCount
                        ] = {
                            $: {
                                Name: serviceName + "_InstanceCount",
                                Value: "1"
                            }
                        };

                        var builder = new xml2js.Builder();
                        var xml = builder.buildObject(result);
                        fs.writeFile(
                            path.join(appParametersPath, "Local.1Node.xml"),
                            xml,
                            function(err) {
                                if (err) {
                                    return console.log(err);
                                }
                            }
                        );
                    });
                }
            );

            fs.readFile(
                path.join(appParametersPath, "Local.5Node.xml"),
                function(err, data) {
                    parser.parseString(data, function(err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        var parameterCount =
                            result["Application"]["Parameters"][0]["Parameter"]
                                .length;

                        result["Application"]["Parameters"][0]["Parameter"][
                            parameterCount
                        ] = {
                            $: {
                                Name: serviceName + "_ASPNETCORE_ENVIRONMENT",
                                Value: "Local"
                            }
                        };

                        parameterCount++;

                        result["Application"]["Parameters"][0]["Parameter"][
                            parameterCount
                        ] = {
                            $: {
                                Name: serviceName + "_InstanceCount",
                                Value: "1"
                            }
                        };

                        var builder = new xml2js.Builder();
                        var xml = builder.buildObject(result);
                        fs.writeFile(
                            path.join(appParametersPath, "Local.5Node.xml"),
                            xml,
                            function(err) {
                                if (err) {
                                    return console.log(err);
                                }
                            }
                        );
                    });
                }
            );
        }
    }

    _generateServiceManifest(
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

    _generateInstallScript() {
        var is_Windows = process.platform == "win32";
        var sdkScriptExtension;
        if (is_Windows) {
            sdkScriptExtension = ".ps1";
        } else {
            sdkScriptExtension = ".sh";
        }

        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath("main/deploy/deploy" + sdkScriptExtension),
                this.destinationPath(
                    path.join(appPackage, "install" + sdkScriptExtension)
                ),
                {
                    appPackage: appPackage,
                    appName: appName,
                    appTypeName: appTypeName
                }
            );
        }
    }

    _generateUnInstallScript() {
        var is_Windows = process.platform == "win32";
        var sdkScriptExtension;
        if (is_Windows) {
            sdkScriptExtension = ".ps1";
        } else {
            sdkScriptExtension = ".sh";
        }

        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath("main/deploy/un-deploy" + sdkScriptExtension),
                this.destinationPath(
                    path.join(appPackage, "uninstall" + sdkScriptExtension)
                ),
                {
                    appPackage: appPackage,
                    appName: appName,
                    appTypeName: appTypeName
                }
            );
        }
    }

    _generateUpgradeScript() {
        var is_Windows = process.platform == "win32";
        var sdkScriptExtension;
        if (is_Windows) {
            sdkScriptExtension = ".ps1";
        } else {
            sdkScriptExtension = ".sh";
        }

        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath("main/deploy/upgrade" + sdkScriptExtension),
                this.destinationPath(
                    path.join(appPackage, "upgrade" + sdkScriptExtension)
                ),
                {
                    appPackage: appPackage,
                    appName: appName,
                    appTypeName: appTypeName
                }
            );
        }
    }

    _generateBuildScript() {
        var is_Windows = process.platform == "win32";
        var buildScriptExtension;
        if (is_Windows) {
            buildScriptExtension = ".cmd";
        } else {
            buildScriptExtension = ".sh";
        }

        if (this.isAddNewService == false) {
            this.fs.copyTpl(
                this.templatePath("main/build/build" + buildScriptExtension),
                this.destinationPath(
                    path.join(appPackage, "build" + buildScriptExtension)
                ),
                {
                    serviceProject: serviceProject,
                    codePath: codePath
                }
            );
        } else {
            var nodeFs = require("fs");
            var appendToSettings = null;
            if (is_Linux || is_mac) {
                var appendToSettings =
                    "\n\
          \ndotnet restore $DIR/../" +
                    serviceProject +
                    " -s https://api.nuget.org/v3/index.json \
          \ndotnet build $DIR/../" +
                    serviceProject +
                    " -v normal\
          \ncd " +
                    "`" +
                    "dirname $DIR/../" +
                    serviceProject +
                    "`" +
                    "\ndotnet publish -o ../../../../" +
                    appName +
                    "/" +
                    appName +
                    "/" +
                    servicePackage +
                    "/Code\
          \ncd -";
            } else if (is_Windows) {
                var appendToSettings =
                    "\n\
          \ndotnet restore %~dp0\\..\\" +
                    serviceProject +
                    " -s https://api.nuget.org/v3/index.json \
          \ndotnet build %~dp0\\..\\" +
                    serviceProject +
                    ' -v normal\
          \nfor %%F in ("' +
                    serviceProject +
                    '") do cd %%~dpF\
          \ndotnet publish -o %~dp0\\..\\' +
                    appName +
                    "\\" +
                    appName +
                    "\\" +
                    servicePackage +
                    "\\Code";
            }
            nodeFs.appendFile(
                path.join(appPackage, "build" + buildScriptExtension),
                appendToSettings,
                function(err) {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        }
    }

    _linuxOnly() {
        if (is_Linux) {
            this.fs.copyTpl(
                this.templatePath("main/common/dotnet-include.sh"),
                this.destinationPath(
                    path.join(
                        appPackage,
                        appPackagePath,
                        servicePackage,
                        "Code",
                        "dotnet-include.sh"
                    )
                ),
                {}
            );
            if (this.isAddNewService == false) {
                this.fs.copyTpl(
                    this.templatePath("main/common/dotnet-include.sh"),
                    this.destinationPath(
                        path.join(appPackage, "dotnet-include.sh")
                    ),
                    {}
                );
            }
            this.fs.copyTpl(
                this.templatePath(
                    "service/app/appPackage/servicePackage/Code/entryPoint.sh"
                ),
                this.destinationPath(
                    path.join(
                        appPackage,
                        appPackagePath,
                        servicePackage,
                        "Code",
                        "entryPoint.sh"
                    )
                ),
                {
                    serviceProjName: serviceProjName
                }
            );
        }
    }

    _generateContent(
        appName,
        serviceSrcPath,
        servicePackagePath,
        serviceName,
        serviceTypeName,
        serviceMainClass
    ) {
        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Config/Settings.xml"
            ),
            this.destinationPath(
                path.join(servicePackagePath, "Config", "Settings.xml")
            ),
            {
                serviceName: serviceName
            }
        );

        this.fs.copyTpl(
            this.templatePath("service/class/ServiceImpl.cs"),
            this.destinationPath(
                path.join(serviceSrcPath, serviceMainClass + ".cs")
            ),
            {
                serviceName: serviceName,
                serviceMainClass: serviceMainClass
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/project.csproj"),
            this.destinationPath(
                path.join(serviceSrcPath, this.serviceName + ".csproj")
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/Program.cs"),
            this.destinationPath(path.join(serviceSrcPath, "Program.cs")),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName,
                serviceTypeName: serviceTypeName,
                serviceMainClass: serviceMainClass
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/ServiceEventListener.cs"),
            this.destinationPath(
                path.join(serviceSrcPath, "ServiceEventListener.cs")
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName,
                appName: appName,
                serviceTypeName: serviceTypeName
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/ServiceEventSource.cs"),
            this.destinationPath(
                path.join(serviceSrcPath, "ServiceEventSource.cs")
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName,
                appName: appName
            }
        );

        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Config/_readme.txt"
            ),
            this.destinationPath(
                path.join(servicePackagePath, "Config", "_readme.txt")
            )
        );

        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Data/_readme.txt"
            ),
            this.destinationPath(
                path.join(servicePackagePath, "Data", "_readme.txt")
            )
        );
    }

    //#endregion

    //#region Private Methods

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_inquiries() {
        var utility = require("../utility");

        var inquiries = [
            {
                key: this.SERVICENAME,
                value: {
                    type: "input",
                    name: this.SERVICENAME,
                    message: "Enter Reliable Service's name: ",
                    validate: function(input) {
                        return input ? utility.validateFQN(input) : false;
                    },
                    default: this.config.get(this.SERVICENAME),
                    store: false
                }
            },
            {
                key: this.PATH,
                value: {
                    type: "input",
                    name: this.PATH,
                    message: "Enter relative path to this service: ",
                    default: this.config.get(this.PATH),
                    store: false
                }
            }
        ];

        var result = [];

        inquiries.forEach(inquiry => {
            if (
                this.options[inquiry.key] == "" ||
                this.options[inquiry.key] == undefined
            ) {
                this._logTrace(`Generator Inquiry: ${inquiry.key} was added`);
                result.push(inquiry.value);
            } else {
                this._logTrace(
                    `Generator Inquiry: ${inquiry.key} was updated and added`
                );
                inquiry.value.default = this.options[inquiry.key];
                result.push(inquiry.value);
            }
        });

        return result;
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_arguments_config() {
        // This makes `projName` a argument.
        this.argument(this.SERVICENAME, {
            description: "Service Fabric reliable service's name",
            type: String,
            required: false,
            default: ""
        });
    }

    _generator_arguments_handler() {
        // And you can then access it later; e.g.
        this._logTrace(
            `Generator Argument ${this.SERVICENAME}: ${
                this.options[this.SERVICENAME]
            }`
        );
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_options_config() {
        this.option(this.CONTAINER_PATH, {
            type: String,
            require: true
        });

        this.option(this.LOGGING, {
            type: Boolean,
            default: false
        });
        this.option(this.LIB_PATH, {
            type: String,
            require: true
        });
        this.option(this.ADD_NEW_SERVICE, {
            type: Boolean,
            require: true
        });
    }

    _generator_options_handler() {
        this.containerPath = this.options[this.CONTAINER_PATH];
        const storePath = path.join(this.containerPath, ".yo-rc.json");
        this.config = new Storage(this.rootGeneratorName(), this.fs, storePath);
        this._logTrace(
            `Generator Option ${this.CONTAINER_PATH}: ${
                this.options[this.CONTAINER_PATH]
            }`
        );

        this._logTrace(
            `Generator Option ${this.LOGGING}: ${this.options[this.LOGGING]}`
        );

        this.libPath = this.options[this.LIB_PATH];
        this._logTrace(
            `Generator Option ${this.LIB_PATH}: ${this.options[this.LIB_PATH]}`
        );

        this.isAddNewService = this.options[this.ADD_NEW_SERVICE];
        this._logTrace(
            `Generator Option ${this.ADD_NEW_SERVICE}: ${
                this.options[this.ADD_NEW_SERVICE]
            }`
        );
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _logTrace(message) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::TRACE:: >> ${message}`);
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _logInfo(message) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::INFO:: >> ${message}`);
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _logError(error) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::ERROR:: >> ${error}`);
    }

    //#endregion
};

module.exports = ClassGenerator;
