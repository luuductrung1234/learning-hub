var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is import so out generator is correctly setup
        super(args, opts);

        // Next, add your custom code
        this.option('bable'); // this method adds suport for a `--bable` flag
    }

    onStart() {
        this.log('Starting...');
    }

    onEnd() {
        this.log('Ending...');
    }
};
