:: innitialize entire c:: solution
:: contains:
::  - .NET Core Console
::  - .NET Core Class Library
::  - ASP.NET Core API
:: notice:
::  - the commands below do not required to execute in sequence

echo "==================================="
echo "=           START::INIT           ="
echo "==================================="

:: solution file
dotnet new sln -n "simple-side" -o ./simple

:: class library project
dotnet new classlib -n "simple-lib" -o ./simple/simple-lib

:: class webapi project
dotnet new webapi -n "simple-api" -o ./simple/simple-api

:: class console (UI) project
dotnet new console -n "simple-console" -o ./simple/simple-console

echo "==================================="
echo "=            END::INIT            ="
echo "==================================="