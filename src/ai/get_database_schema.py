import time
import re

def get_database_schema(input: dict) -> dict:
    """
    Simulates fetching database schema from a given URI.

    Args:
        input: A dictionary with a 'uri' key (string) representing the database connection URI.

    Returns:
        A dictionary with a 'schema' key (string) containing the database schema.
    """
    uri = input.get('uri', '')

    # Simulate network delay
    time.sleep(1.5)

    mock_schema = """
-- Mock schema based on URI: {}
CREATE TABLE Users (
  UserID INT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL,
  Email VARCHAR(255) UNIQUE,
  RegistrationDate DATE
);

CREATE TABLE Products (
  ProductID INT PRIMARY KEY,
  ProductName VARCHAR(255) NOT NULL,
  Price DECIMAL(10, 2),
  StockQuantity INT
);

CREATE TABLE Orders (
  OrderID INT PRIMARY KEY,
  UserID INT,
  OrderDate TIMESTAMP,
  TotalAmount DECIMAL(10, 2),
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
    """.format(uri)

    if 'postgres' in uri.lower():
        mock_schema = """
-- Mock PostgreSQL schema for: {}
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    hire_date DATE
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE
);
        """.format(uri)
    elif 'mysql' in uri.lower():
        mock_schema = """
-- Mock MySQL schema for: {}
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    contact_email VARCHAR(100)
);

CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    sale_date DATE,
    amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
        """.format(uri)

    # Simulate a small chance of error for testing purposes
    if 'error' in uri.lower():
        raise Exception("Mock error: Could not connect to the database URI or invalid URI provided.")

    return {"schema": mock_schema.strip()}

if __name__ == '__main__':
    # Example usage:
    print(get_database_schema({'uri': 'mysql://user:pass@host:port/db'}))
    print(get_database_schema({'uri': 'postgres://user:pass@host:port/db'}))
    print(get_database_schema({'uri': 'sqlite:///mydatabase.db'}))
    try:
        get_database_schema({'uri': 'error://invalid'})
    except Exception as e:
        print(e)