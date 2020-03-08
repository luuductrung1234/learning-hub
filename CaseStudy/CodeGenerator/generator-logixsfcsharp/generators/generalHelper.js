module.exports = {
    linuxOnly: function() {
        if (is_Linux) {
            this.fs.copyTpl(
                this.templatePath("main/common/dotnet-include.sh"),
                this.destinationPath(
                    path.join(
                        appPackage,
                        appPackagePath,
                        servicePackage,
                        "Code",
                        "dotnet-include.sh"
                    )
                ),
                {}
            );
            if (this.isAddNewService == false) {
                this.fs.copyTpl(
                    this.templatePath("main/common/dotnet-include.sh"),
                    this.destinationPath(
                        path.join(appPackage, "dotnet-include.sh")
                    ),
                    {}
                );
            }
            this.fs.copyTpl(
                this.templatePath(
                    "service/app/appPackage/servicePackage/Code/entryPoint.sh"
                ),
                this.destinationPath(
                    path.join(
                        appPackage,
                        appPackagePath,
                        servicePackage,
                        "Code",
                        "entryPoint.sh"
                    )
                ),
                {
                    serviceProjName: serviceProjName
                }
            );
        }
    }
}