"use strict";

var Generator = require("yeoman-generator");
var Storage = require("yeoman-generator/lib/util/storage");

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

    GUEST_USECASE = "isGuestUseCase";
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
    }

    //#region Squence Methods

    /**
     * initialization methods (checking current project state, getting configs, etc
     */
    initalizing() {}

    /**
     * Where to prompt users for options (where to call this.prompt())
     */
    async prompting() {
        this.log(yosay("Welcome to Service Fabric generator for CSharp"));

        var prompts = this._generator_inquiries();
        await this.prompt(prompts).then(answers => {
            answers[this.APPNAME] = answers[this.APPNAME].trim();

            this.props = answers;

            // override a storepath which store file '.yo-rc.json'
            this.solutionPath = path.join(this.destinationRoot(), answers[this.SOLUTIONNAME]);
            const storePath = path.join(this.solutionPath, ".yo-rc.json");
            this.config = new Storage(this.rootGeneratorName(), this.fs, storePath);

            // update config
            this.config.set(answers);
        });

        this._logTrace(
            `Generator's Property ${this.APPNAME}: ${this.props[this.APPNAME]}`
        );
        this._logTrace(
            `Generator's Property ${this.FRAMEWORK_TYPE}: ${
                this.props[this.FRAMEWORK_TYPE]
            }`
        );
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
        var isAddNewService = false;

        if (this.props[this.FRAMEWORK_TYPE] == this.ACTOR_FRAMEWORK_TYPE) {
            this.composeWith(require.resolve("../CoreCLRStatefulActor"), {
                containerPath: this.solutionPath,
                logging: this.options[this.LOGGING],
                libPath: libPath,
                isAddNewService: isAddNewService
            });
        } else if (
            this.props[this.FRAMEWORK_TYPE] ==
            this.STATELESS_SERVICE_FRAMEWORK_TYPE
        ) {
            this.composeWith(require.resolve("../CoreCLRStatelessService"), {
                containerPath: this.solutionPath,
                logging: this.options[this.LOGGING],
                libPath: libPath,
                isAddNewService: isAddNewService
            });
        } else if (
            this.props[this.FRAMEWORK_TYPE] ==
            this.STATEFUL_SERVICE_FRAMEWORK_TYPE
        ) {
            this.composeWith(require.resolve("../CoreCLRStatefulService"), {
                containerPath: this.solutionPath,
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
        if (this.options[this.GUEST_USECASE] == false) {
            //this is for Add Service
            var nodeFs = require("fs");
            if (
                nodeFs
                    .statSync(path.join(this.solutionPath, ".yo-rc.json"))
                    .isFile()
            ) {
                nodeFs
                    .createReadStream(
                        path.join(this.solutionPath, ".yo-rc.json")
                    )
                    .pipe(
                        nodeFs.createWriteStream(
                            path.join(
                                this.solutionPath,
                                this.props[this.APPNAME],
                                ".yo-rc.json"
                            )
                        )
                    );
            }
        }
    }

    //#endregion

    //#region Private Methods

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @return {any[]} inquiries
     * @private
     */
    _generator_inquiries() {
        var utility = require("../utility");

        var inquiries = [
            {
                key: this.SOLUTIONNAME,
                value: {
                    type: "input",
                    name: this.SOLUTIONNAME,
                    message: "Enter Solution's name: ",
                    default: this.config.get(this.SOLUTIONNAME),
                    validate: function(input) {
                        return input ? utility.validateFQN(input) : false;
                    },
                    store: false
                }
            },
            {
                key: this.APPNAME,
                value: {
                    type: "input",
                    name: this.APPNAME,
                    message: "Enter Service Fabric Application's name: ",
                    default: this.config.get(this.APPNAME),
                    validate: function(input) {
                        return input ? utility.validateFQN(input) : false;
                    },
                    store: false
                }
            },
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
     * @private
     */
    _generator_arguments_config() {
        // This makes `projName` a argument.
        this.argument(this.APPNAME, {
            description: "Enter Service Fabric Application's name",
            type: String,
            required: false,
            default: ""
        });
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @private
     */
    _generator_arguments_handler() {
        // And you can then access it later; e.g.
        this._logTrace(
            `Generator Argument ${this.APPNAME}: ${this.options[this.APPNAME]}`
        );

        this._logTrace(
            `Generator Argument ${this.SOLUTIONNAME}: ${this.options[this.SOLUTIONNAME]}`
        );
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @private
     */
    _generator_options_config() {
        // This makes `logging` a option.
        this.option(this.LOGGING, {
            description: "Enable logging while using generator",
            type: Boolean,
            alias: "log",
            default: false
        });

        // This makes `isGuestUseCase` a option.
        this.option(this.GUEST_USECASE, {
            description: "Is generator running on guest usecase?",
            type: Boolean,
            alias: "guest",
            default: false
        });
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @private
     */
    _generator_options_handler() {
        // And you can then access it later; e.g.
        this._logTrace(
            `Generator Option ${this.LOGGING}: ${this.options[this.LOGGING]}`
        );
        this._logTrace(
            `Generator Option ${this.GUEST_USECASE}: ${
                this.options[this.GUEST_USECASE]
            }`
        );
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @private
     */
    _logTrace(message) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::TRACE:: >> ${message}`);
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     * @private
     */
    _logInfo(message) {
        if (this.options[this.LOGGING])
            this.log(`::GENERATOR::INFO:: >> ${message}`);
    }

    //#endregion
};

module.exports = CSharpGenerator;
