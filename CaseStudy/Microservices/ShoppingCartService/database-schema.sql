USE master
GO

-- Create a new database called 'ecommerce_masterdata'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT name
FROM [sys].[databases]
WHERE name = N'ecommerce_masterdata'
)
CREATE DATABASE ecommerce_masterdata
GO

USE [ecommerce_masterdata]
GO

-- Create a new table called 'shopping_cart' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.shopping_cart', 'U') IS NOT NULL
DROP TABLE [dbo].[shopping_cart]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[shopping_cart]
(
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    [UserId] INT NOT NULL
    -- specify more columns here
);
GO

CREATE INDEX shoppingcart_userid
ON [dbo].[shopping_cart] (UserId)
GO

-- Create a new table called 'shopping_cart_items' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.shopping_cart_items', 'U') IS NOT NULL
DROP TABLE [dbo].[shopping_cart_items]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[shopping_cart_items]
(
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    [ShoppingCartId] INT NOT NULL,
    -- foreign key column
    [ProductCatalogId] BIGINT NOT NULL,
    [ProductName] NVARCHAR(100) NOT NULL,
    [ProductDescription] NVARCHAR(500) NULL,
    [Amount] INT NOT NULL,
    [CURRENCY] NVARCHAR(5) NOT NULL
    -- specify more columns here
);
GO

ALTER TABLE [dbo].[shopping_cart_items]  WITH CHECK ADD CONSTRAINT [FK_ShoppingCart] FOREIGN KEY([ShoppingCartId])
REFERENCES [dbo].[shopping_cart] ([ID])
GO

ALTER TABLE [dbo].[shopping_cart_items] CHECK CONSTRAINT [FK_ShoppingCart]
GO

CREATE INDEX shoppingcartitems_shoppingcartid
ON [dbo].[shopping_cart_items] (ShoppingCartId)
GO

-- Create a new table called 'event_store' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.event_store', 'U') IS NOT NULL
DROP TABLE [dbo].[event_store]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[event_store]
(
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    [Name] [NVARCHAR](100) NOT NULL,
    [OccurredAt] DATETIMEOFFSET NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL
    -- specify more columns here
);
GO


