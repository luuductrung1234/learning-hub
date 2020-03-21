USE master
GO

-- Create a new database called 'ecommerce_masterdata'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT name
FROM sys.databases
WHERE name = N'ecommerce_masterdata'
)
CREATE DATABASE ecommerce_masterdata
GO

USE ecommerce_masterdata
GO

-- Create a new table called 'shopping_cart' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.shopping_cart', 'U') IS NOT NULL
DROP TABLE dbo.shopping_cart
GO
-- Create the table in the specified schema
CREATE TABLE dbo.shopping_cart
(
    ID INT NOT NULL PRIMARY KEY,
    -- primary key column
    UserId INT NOT NULL
    -- specify more columns here
);
GO


-- Create a new table called 'shopping_cart_items' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.shopping_cart_items', 'U') IS NOT NULL
DROP TABLE dbo.shopping_cart_items
GO
-- Create the table in the specified schema
CREATE TABLE dbo.shopping_cart_items
(
    ID INT NOT NULL PRIMARY KEY,
    -- primary key column
    ShoppingCartId INT NOT NULL FOREIGN KEY REFERENCES dbo.shopping_cart(ID),
    -- foreign key column
    ProductCatalogId BIGINT NOT NULL,
    ProductName NVARCHAR(100) NOT NULL,
    ProductDescription NVARCHAR(500) NULL,
    Amount INT NOT NULL,
    CURRENCY NVARCHAR(5) NOT NULL
    -- specify more columns here
);
GO