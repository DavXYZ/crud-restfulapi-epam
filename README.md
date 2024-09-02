# Product Management API

## Overview

This project is a RESTful API built with Node.js, Express.js, and TypeScript. It provides CRUD operations for managing product information, including capabilities for adding, updating, retrieving, and deleting products. The API uses JSON files for storage and supports operations such as filtering products by category and soft deleting products.

## Project Structure

The project is organized as follows:

- `src/`
  - `controllers/`
    - `crudController.ts`: Contains CRUD operations for products.
    - `productController.ts`: Contains operations related to product categories and updating product addresses.
  - `middlewares/`
    - `validation/validateProduct.ts`: Middleware for validating product input.
    - `requestLogger.ts`: Middleware for logging HTTP requests.
  - `models/`
    - `productModel.ts`: Defines the `ProductModel` interface.
  - `routes/`
    - `crudRoutes.ts`: Defines routes for CRUD operations.
    - `productRoutes.ts`: Defines routes for product-related operations.
  - `services/`
    - `crudService.ts`: Contains service methods for handling product data.
    - `productService.ts`: Contains advanced serivce methods
  - `index.ts`: Entry point for the application.
  - `products.json`: Fake Database

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**

   git clone https://github.com/DavXYZ/crud-restfulapi-epam
   cd crud-restfullapi-epam

2. **Install Dependencies**

Make sure you have Node.js installed. Then run:
    npm install

3. **Build the Project**

Compile TypeScript code to JavaScript:

    npm run build

4. **Run the Application**

Start the server:
    npm start

*By default, the server runs on port 8080. You can change this by modifying the index.ts file.*

## API Endpoints

*CRUD Operations*

* Get All Products
    GET /api/crud

* Add a Product
    POST /api/crud

* Update a Product
    PUT /api/crud/{id}

* Delete a Product and remove from products.json
    DELETE /api/crud/{id}

*Advanced Operations*

* Get All Products by Category
    GET /api/products?category={category}
  
* Get By Id
    GET /api/products/{id}

* Update Product Street
    PUT /api/products/{id}/street

* Posting validated data (stock.available and price)
    POST /api/products
  
* Soft Delete
    DELETE /api/products/${id}

## Middlewares
1. Request Logger
   -Logs details of incoming requests, including HTTP method, URL, status code, and response time. This middleware helps in tracking the API usage and debugging issues.
*Example Log Entry*
[INFO] [2024-09-02T15:30:00Z] [GET] /api/crud 200 OK 123ms

2. validateProduct for POST request



## Product Validation
   Validates the product data against the expected format. This ensures that all required fields are provided and prevents the introduction of invalid data.

Validation Rules:

* id: Required, must be a string.
* name: Required, must be a string.
* description: Required, must be a string.
* price: Required, must be a number.
* category: Required, must be a string.
* stock: Required, must be an object with available, reserved, and location.
* tags: Optional, must be an array of strings.
* rating: Optional, must be a number.
* deleted: Optional, must be a boolean.
* manufacturer.address.street: Optional, must be a string.


## Acknowledgements
* Express.js: A web framework for building APIs.
* TypeScript: A superset of JavaScript that adds static typing.
* fs-extra: A module that extends the built-in fs module with additional features.
* chalk: A library for styling terminal strings.
