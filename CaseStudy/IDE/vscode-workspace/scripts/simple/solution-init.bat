:: innitialize entire c:: solution
:: contains:
::  - .NET Core Console
::  - .NET Core Class Library
::  - ASP.NET Core API
:: notice:
::  - the commands below do not required to execute in sequence

@echo off

echo "==================================="
echo "=           START::INIT           ="
echo "==================================="

for /F %%i in ('dir /b /a ".\simple\*"') do (
    echo ".\simple is not Empty"
    goto :EOF
)

echo "==================================="
echo "=            END::INIT            ="
echo "==================================="