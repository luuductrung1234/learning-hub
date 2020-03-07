"use strict";

var Generator = require("yeoman-generator");

var _fs = require("fs");
var _path = require("path");
// var _yosay = require("yosay");
// var _chalk = require("chalk");
// var _wiredep = require("wiredep");

var CSharpGenerator = class extends Generator {
    APPNAME = "appname";

    constructor(args, opts) {
        // Calling the super constructor is import so out generator is correctly setup
        super(args, opts);

        // TODO: Next, add your custom code
        this._generator_arguments_config();
    }

    /**
     * Your initialization methods (checking current project state, getting configs, etc
     */
    initalizing() {}

    /**
     * Where you prompt users for options (where you’d call this.prompt())
     */
    async prompting() {
        const answers = await this.prompt(this._generator_inquiries());

        this.log(`::GENERATOR::INFO:: >>  Application's name ${answers[this.APPNAME]}`)
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
     * Where you write the generator specific files (routes, controllers, etc)
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
                key: this.APPNAME,
                value: {
                    type: "input",
                    name: this.APPNAME,
                    message: "Your Service Fabric Application's name: ",
                    default: this.appname, // Default to current folder name
                    store: false
                }
            }
        ];

        var result = [];

        inquiries.forEach(inquiry => {
            if(this.options[inquiry.key] == "" || this.options[inquiry.key] == undefined) {
                this.log(`::GENERATOR::INFO:: >>  Inquiry ${inquiry.key} was added`)
                result.push(inquiry.value);
            }
            else {
                this.log(`::GENERATOR::INFO:: >>  Inquiry ${inquiry.key} was ignored`)
            }
        });

        return result;
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_arguments_config() {
        // This makes `appname` a required argument.
        this.argument(this.APPNAME, { description: "Service Fabric application's name", type: String, required: false, default: "" });

        // And you can then access it later; e.g.
        this.log(`::GENERATOR::INFO:: >> Application's name: ${this.options[this.APPNAME]}`);
    }

    /**
     * This method is not a Yeoman's task.
     * It is not run in sequence by the Yeoman environment run loop.
     */
    _generator_options_config() {
        // This makes `appname` a required argument.
        this.argument(this.APPNAME, { description: "Service Fabric application's name", type: String, required: false, default: "" });

        // And you can then access it later; e.g.
        this.log(`::GENERATOR::INFO:: >> Application's name: ${this.options[this.APPNAME]}`);
    }
};

module.exports = CSharpGenerator;
