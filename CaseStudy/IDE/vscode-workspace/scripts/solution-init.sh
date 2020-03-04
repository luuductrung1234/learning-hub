# innitialize entire c# solution
# contains:
#  - .NET Core Console
#  - .NET Core Class Library
#  - ASP.NET Core API

echo "==================================="
echo "=           START::INIT           ="
echo "==================================="

# solution file
dotnet new sln -n "simple-side"

# class library project
dotnet new classlib -n "simple-lib"

# class webapi project
dotnet new webapi -n "simple-api"

# class console (UI) project
dotnet new console -n "simple-console"

echo "==================================="
echo "=            END::INIT            ="
echo "==================================="