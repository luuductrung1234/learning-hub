"use strict";

var Generator = require("yeoman-generator");

var path = require("path");
// var chalk = require("chalk");
// var wiredep = require("wiredep");

var ClassGenerator = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is import so out generator is correctly setup
        super(args, opts);

        // TODO: Next, add your custom code
        this._generator_options_config();
        this._generator_options_handler();
        this._generator_arguments_config();
        this._generator_arguments_handler();

        this.desc("Generate Service Fabric Stateful Service app template");
    }

    /**
     * initialization methods (checking current project state, getting configs, etc
     */
    initalizing() {}

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
    writing() {}

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
        var inquiries = [
            {
                key: "INPUTKEY",
                value: {
                    type: "input",
                    name: "INPUTKEY",
                    message: "Your Service Fabric Application's name: ",
                    default: this.config.get("INPUTKEY"),
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
        // this.argument(this.PROJECTNAME, {
        //     description: "Service Fabric application's name",
        //     type: String,
        //     required: false,
        //     default: ""
        // });
    }

    _generator_arguments_handler() {
        // And you can then access it later; e.g.
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_options_config() {
        // This makes `logging` a option.
        // this.option(this.LOGGING, {
        //     description: "Enable logging while using generator",
        //     type: Boolean,
        //     alias: "log",
        //     default: false
        // });
    }

    _generator_options_handler() {
        // And you can then access it later; e.g.
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
