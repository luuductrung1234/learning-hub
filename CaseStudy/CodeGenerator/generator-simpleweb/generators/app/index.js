"use strict";

var Generator = require("yeoman-generator");

var _fs = require("fs");
var _path = require("path");
var _yosay = require("yosay");
var _chalk = require("chalk");
var _wiredep = require("wiredep");

class BaseGenerator extends Generator {
    baseHelper() {
        this.log(
            "This method is methods on the parent generator, it is not a task"
        );
        this.log("It is run in sequence by the Yeoman environment run loop.");
    }
}

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option("babel"); // This method adds support for a `--babel` flag

        this.privateHelper = function() {
            this.log("This method is not a task");
            this.log(
                "It is run in sequence by the Yeoman environment run loop."
            );
        };
    }

    onStart() {
        this.log("Starting...");
    }

    onRunning() {
        this.prompt([
            {
                type: "input",
                name: "name",
                message:
                    "Enter a name for the new component (i.e.: myNewComponent): "
            }
        ]).then(answers => {
            // create destination folder
            this.destinationRoot(answers.name);

            this.fs.copyTpl(
                this.templatePath("index.html"),
                this.destinationPath(answers.name + ".html"),
                {
                    title: answers.name,
                    message: "Hello World!"
                }
            );

            this.fs.copyTpl(
                this.templatePath("style.css"),
                this.destinationPath("style.css")
            );

            this.log("Ending...");
        });
    }

    _private_method() {
        this.log("This method is not a task");
        this.log("It is run in sequence by the Yeoman environment run loop.");
    }

    _third_private_method() {
        this.log("This method is not a task");
        this.log(
            "It is run in sequence by the Yeoman environment run loop."
        );
    }
};
