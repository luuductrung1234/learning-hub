# attach all projects into c# solution
# notice:
#  - the commands below are required to execute in sequence

dotnet sln ./simple/simple-side.sln add **/simple/**/*.csproj

dotnet add ./simple/simple-api/simple-api.csproj reference ./simple/simple-lib/simple-lib.csproj

dotnet add ./simple/simple-console/simple-console.csproj reference ./simple/simple-lib/simple-lib.csproj