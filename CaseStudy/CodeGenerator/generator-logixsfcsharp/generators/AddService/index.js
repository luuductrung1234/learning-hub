"use strict";

var Generator = require("yeoman-generator");

var path = require("path");
var yosay = require("yosay");
// var chalk = require("chalk");
// var wiredep = require("wiredep");

var CSharpGenerator = class extends Generator {
    SOLUTIONNAME = "solutionname";
    APPNAME = "appname";

    FRAMEWORK_TYPE = "frameworkType";
    ACTOR_FRAMEWORK_TYPE = "Reliable Actor Service";
    STATELESS_SERVICE_FRAMEWORK_TYPE = "Reliable Stateless Service";
    STATEFUL_SERVICE_FRAMEWORK_TYPE = "Reliable Stateful Service";

    LOGGING = "logging";

    constructor(args, opts) {
        // Calling the super constructor is import so out generator is correctly setup
        super(args, opts);

        // TODO: Next, add your custom code
        this._generator_options_config();
        this._generator_options_handler();
        this._generator_arguments_config();
        this._generator_arguments_handler();

        this.desc("Generate Service Fabric CSharp app template");
        var chalk = require("chalk");
        if (this.config.get(this.APPNAME)) {
            this._logInfo(
                chalk.green(
                    "Setting project name to",
                    this.config.get(this.APPNAME)
                )
            );
        } else {
            var err = chalk.red(
                "Project name not found in .yo-rc.json. Exiting ..."
            );
            throw err;
        }
    }

    //#region Sequence Methods

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
        var prompts = this._generator_inquiries();
        
        await this.prompt(prompts).then(answers => {
            this.props = answers;
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
        var libPath = "REPLACE_SFLIBSPATH";
        var isAddNewService = true;

        if (this.props[this.FRAMEWORK_TYPE] == this.ACTOR_FRAMEWORK_TYPE) {
            this.composeWith(require.resolve("../CoreCLRStatefulActor"), {
                containerPath: this.destinationRoot(),
                logging: this.options[this.LOGGING],
                libPath: libPath,
                isAddNewService: isAddNewService
            });
        } else if (
            this.props[this.FRAMEWORK_TYPE] ==
            this.STATELESS_SERVICE_FRAMEWORK_TYPE
        ) {
            this.composeWith(require.resolve("../CoreCLRStatelessService"), {
                containerPath: this.destinationRoot(),
                logging: this.options[this.LOGGING],
                libPath: libPath,
                isAddNewService: isAddNewService
            });
        } else if (
            this.props[this.FRAMEWORK_TYPE] ==
            this.STATEFUL_SERVICE_FRAMEWORK_TYPE
        ) {
            this.composeWith(require.resolve("../CoreCLRStatefulService"), {
                containerPath: this.destinationRoot(),
                logging: this.options[this.LOGGING],
                libPath: libPath,
                isAddNewService: isAddNewService
            });
        }
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
    end() {
        this.config.save();
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
                key: this.FRAMEWORK_TYPE,
                value: {
                    type: "list",
                    name: this.FRAMEWORK_TYPE,
                    message: "Choose a framework for your service: ",
                    default: this.config.get(this.FRAMEWORK_TYPE),
                    choices: [
                        this.ACTOR_FRAMEWORK_TYPE,
                        this.STATEFUL_SERVICE_FRAMEWORK_TYPE,
                        this.STATELESS_SERVICE_FRAMEWORK_TYPE
                    ],
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
    _generator_arguments_config() {}

    _generator_arguments_handler() {}

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_options_config() {
        // This makes `logging` a option.
        this.option(this.LOGGING, {
            description: "Enable logging while using generator",
            type: Boolean,
            alias: "log",
            default: false
        });
    }

    _generator_options_handler() {
        // And you can then access it later; e.g.
        this._logTrace(
            `Generator Option ${this.LOGGING}: ${this.options[this.LOGGING]}`
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

    //#endregion
};

module.exports = CSharpGenerator;
