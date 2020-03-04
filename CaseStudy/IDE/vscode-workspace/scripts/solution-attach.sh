# attach all projects into c# solution
# notice:
#  - the commands below are required to execute in sequence

dotnet sln simple-side.sln add **/*.csproj

dotnet add ./simple-api/simple-api.csproj reference ./simple-lib/simple-lib.csproj

dotnet add ./simple-console/simple-console.csproj reference ./simple-lib/simple-lib.csproj