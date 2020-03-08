"use strict";

var Generator = require("yeoman-generator");

var path = require("path");
// var chalk = require("chalk");
// var wiredep = require("wiredep");

var ClassGenerator = class extends Generator {
    SOLUTIONNAME = "solutionname";
    APPNAME = "appname";
    SERVICENAME = "servicename";
    PATH = "path";

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

    /**
     * initialization methods (checking current project state, getting configs, etc
     */
    initalizing() {
        this.props = this.config.getAll();
        this.config.defaults({
            author: "<your name>"
        });
    }

    /**
     * Where to prompt users for options (where to call this.prompt())
     */
    async prompting() {
        var utility = require("../utility");

        var prompts = this._generator_inquiries();

        await this.prompt(prompts).then(answers => {
            this.path = answers[this.PATH];
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
        var helper = require("../generalHelper");
        var manifestHelper = require("../manifestHelper");
        var scriptHelper = require("../scriptHelper");

        // application variables
        var appProjName = this.props[this.APPNAME];
        var appTypeName = this.props[this.APPNAME] + "Type";
        var appSrcPath = path.join(
            this.props[this.SOLUTIONNAME],
            this.props[this.APPNAME]
        );
        var appProjectFileName = path.join(appSrcPath, appProjName + ".sfproj");
        var appPackagePath = path.join(appSrcPath, "ApplicationPackageRoot");
        var appParametersPath = path.join(appSrcPath, "ApplicationParameters");

        // service variables
        var serviceProjName = this.serviceName;
        var servicePackageName = this.serviceName + "Pkg";
        var serviceTypeName = this.serviceName + "Type";
        var serviceName = this.serviceName;
        var serviceSrcPath = path.join(
            this.props[this.SOLUTIONNAME],
            this.path,
            this.serviceName
        );
        var serviceProjectFileName = path.join(
            serviceSrcPath,
            serviceProjName + ".csproj"
        );
        var servicePackagePath = path.join(serviceSrcPath, "PackageRoot");
        var endpoint = Math.floor(Math.random() * 9000) + 8000;

        manifestHelper.generateApplicationManifest(
            appPackagePath,
            appTypeName,
            serviceName,
            servicePackageName,
            serviceTypeName
        );

        manifestHelper.generateApplicationParameters(appParametersPath, serviceName);

        manifestHelper.generateServiceManifest(
            servicePackagePath,
            serviceName,
            serviceProjName,
            servicePackageName,
            serviceTypeName,
            endpoint
        );
    }

    _generateContent() {
        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Config/Settings.xml"
            ),
            this.destinationPath(
                path.join(
                    appPackage,
                    appPackagePath,
                    servicePackage,
                    "Config",
                    "Settings.xml"
                )
            ),
            {
                serviceName: serviceName
            }
        );

        this.fs.copyTpl(
            this.templatePath("service/class/ServiceImpl.cs"),
            this.destinationPath(
                path.join(
                    appPackage,
                    "src",
                    serviceSrcPath,
                    this.serviceName + ".cs"
                )
            ),
            {
                serviceName: serviceName,
                serviceName: this.serviceName,
                appName: appName
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/project.csproj"),
            this.destinationPath(
                path.join(
                    appPackage,
                    "src",
                    serviceSrcPath,
                    this.serviceName + ".csproj"
                )
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/Program.cs"),
            this.destinationPath(
                path.join(appPackage, "src", serviceSrcPath, "Program.cs")
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName,
                appName: appName,
                serviceTypeName: serviceTypeName
            }
        );
        this.fs.copyTpl(
            this.templatePath("service/class/ServiceEventListener.cs"),
            this.destinationPath(
                path.join(
                    appPackage,
                    "src",
                    serviceSrcPath,
                    "ServiceEventListener.cs"
                )
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
                path.join(
                    appPackage,
                    "src",
                    serviceSrcPath,
                    "ServiceEventSource.cs"
                )
            ),
            {
                serviceName: this.serviceName,
                authorName: this.props.authorName,
                appName: appName,
                serviceTypeName: serviceTypeName
            }
        );

        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Config/_readme.txt"
            ),
            this.destinationPath(
                path.join(
                    appPackage,
                    appPackagePath,
                    servicePackage,
                    "Config",
                    "_readme.txt"
                )
            )
        );

        this.fs.copyTpl(
            this.templatePath(
                "service/app/appPackage/servicePackage/Data/_readme.txt"
            ),
            this.destinationPath(
                path.join(
                    appPackage,
                    appPackagePath,
                    servicePackage,
                    "Data",
                    "_readme.txt"
                )
            )
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
    _logError(message) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::ERROR:: >> ${message}`);
    }
};

module.exports = ClassGenerator;
