module.exports = {
    generateInstallScript: function() {
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
    },

    generateUnInstallScript: function() {
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
    },

    generateUpgradeScript: function() {
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
    },

    generateBuildScript: function() {
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
                        return this._logError(err);
                    }
                }
            );
        }
    }
}