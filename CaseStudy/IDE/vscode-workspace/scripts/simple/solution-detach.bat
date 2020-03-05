:: remove all individual project from c# solution

@echo off

dotnet sln ./simple/simple-side.sln remove ./simple/simple-console/simple-console.csproj
dotnet sln ./simple/simple-side.sln remove ./simple/simple-api/simple-api.csproj
dotnet sln ./simple/simple-side.sln remove ./simple/simple-lib/simple-lib.csproj