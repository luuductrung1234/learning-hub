:: attach all projects into c# solution
:: notice:
::  - the commands below are required to execute in sequence

dotnet sln simple-side.sln add simple-console/simple-console.csproj
dotnet sln simple-side.sln add simple-api/simple-api.csproj
dotnet sln simple-side.sln add simple-lib/simple-lib.csproj

dotnet add ./simple-api/simple-api.csproj reference ./simple-lib/simple-lib.csproj

dotnet add ./simple-console/simple-console.csproj reference ./simple-lib/simple-lib.csproj