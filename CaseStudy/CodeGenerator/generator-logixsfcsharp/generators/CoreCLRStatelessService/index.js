"use strict";

var Generator = require("yeoman-generator");

var path = require("path");
var yosay = require("yosay");
// var chalk = require("chalk");
// var wiredep = require("wiredep");

var ClassGenerator = class extends Generator {
    PROJECTNAME = "projName";
    SERVICENAME = "serviceFQN";

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
            this.serviceFQN = answers[this.SERVICENAME];
            var parts = this.serviceFQN.split(".");
            var name = parts.pop();
            this.packageName = parts.join(".");
            this.dir = parts.join("/");
            this.serviceName = utility.capitalizeFirstLetter(name.trim());
            if (!this.packageName) {
                this.packageName = "statelessservice";
                this.serviceFQN = "statelessservice" + this.serviceFQN;
                this.dir = this.dir + "/statelessservice";
            }
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
        var serviceProjName = this.serviceName;
        var serviceName = this.serviceName;
        var servicePackage = this.serviceName + "Pkg";
        var serviceTypeName = this.serviceName + "Type";

        var appName = this.props[this.PROJECTNAME];
        var appPackage = this.props[this.PROJECTNAME];
        var appTypeName = this.props[this.PROJECTNAME] + "Type";

        var serviceMainClass = this.serviceName + "Service";
        var endpoint = serviceName + "Endpoint";

        var serviceSrcPath = path.join(
            this.props[this.PROJECTNAME],
            serviceProjName
        );
        var serviceProject = path.join(
            appPackage,
            "src",
            serviceSrcPath,
            serviceProjName + ".csproj"
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
            description: "Enable logging while using generator",
            type: Boolean,
            alias: "log",
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
};

module.exports = ClassGenerator;
