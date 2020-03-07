var Generator = require("yeoman-generator");

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option("babel"); // This method adds support for a `--babel` flag
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
                this.templatePath('index.html'),
                this.destinationPath(answers.name + '.html'),
                {
                    title: answers.name,
                    message: 'Hello World!'
                }
            );

            this.fs.copyTpl(
                this.templatePath('style.css'),
                this.destinationPath('style.css')
            );

            this.log("Ending...");
        });
    }
};
