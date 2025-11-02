# Product Management API

## Overview

This project is a RESTful API built with Node.js, Express.js, and TypeScript. It provides CRUD operations for managing product information, including capabilities for adding, updating, retrieving, and deleting products. The API uses JSON files for storage and supports operations such as filtering products by category and soft deleting products.

## Project Structure

The project is organized as follows:
- `src/`
  - `controllers/`
    - `productController.ts`
  - `middlewares/`
    - `validation/validateProduct.ts`
    - `requestLogger.ts`
  - `models/`
    - `productModel.ts`
  - `routes/`
    - `productRoutes.ts`
  - `services/`
    - `productService.ts`
  - `index.ts`
  - `products.json`

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**
```bash
   git clone https://github.com/DavXYZ/crud-restfulapi-epam
   cd crud-restfullapi-epam
```

2. **Install Dependencies**

Make sure you have Node.js installed. Then run:
  ```bash
    npm install
  ```
3. **Build the Project**

Compile TypeScript code to JavaScript:
  ```bash
    npm run build
  ```
4. **Run the Application**

Start the server:
  ```bash
    npm start
  ```
*By default, the server runs on port 8080. You can change this by modifying the index.ts file.*

## API Endpoints

### 1. Get Products (Category)

- **Endpoint:** `GET /api/products`
- **Description:** Retrieves all products. Optionally, you can filter by category using a query parameter.
- **Query Parameters:**
  - `category` (optional): The category to filter products by. It will be converted to lowercase and spaces will be removed.
    - **Endpoint:** `GET /api/products/?category=string`
- **Response:**
  - `200 OK`: Returns a list of products.
  - `404 Not Found`: If no products are found.
  - `500 Internal Server Error`: If there's an error retrieving products.

### 2. Get Product by ID

- **Endpoint:** `GET /api/products/:id`
- **Description:** Retrieves a single product by its ID.
- **Path Parameters:**
  - `id`: The ID of the product to retrieve.
- **Response:**
  - `200 OK`: Returns the product with the specified ID.
  - `404 Not Found`: If the product with the given ID does not exist.
  - `500 Internal Server Error`: If there's an error retrieving the product.

### 3. Add New Product

- **Endpoint:** `POST /api/products`
- **Description:** Adds a new product to the database.
- **Request Body:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "stock": {
      "available": "number",
      "reserved": "number",
      "location": "string"
    },
    "tags": ["string"],
    "rating": "number",
    "deleted": "boolean",
    "manufacturer": {
      "address": {
        "street": "string"
      }
    }
  }
- **Response:**
  - `201 Created`: Returns the newly added product.
  - `400 Bad Request`: If required fields are missing or unrecognized keys are present.
  - `500 Internal Server Error:`: If there's an error adding the product.

### 4. Update Product
- **Endpoint:**  `PUT /api/products/:id`
- **Description:** Update a product by its ID.
- **URL Parameters:**
  - `id`: The ID of the product to update.
- **Request Body:**
  - Fields to update (e.g., `name`, `description`, `price`, `category`, `stock`, `tags`, `rating`, `manufacturer`). Any field in `ProductModel` can be updated.
- **Response:**
  - `200 OK`: Returns the updated product.
  - `404 Not Found`: If the product with the given ID is not found.
  - `400 Bad Request`: If invalid fields are provided.

### 5. Update product street
- **Endpoint:**  `PATCH /api/products/:id`
- **Description:** Update the street address of a product's manufacturer.
- **URL Parameters:**
  - `id`: The ID of the product.
- **Request Body:**
  - `street` (string): New street address for the manufacturer. Must be a non-empty string.
  ```json
  {
  "street": "string"
  }

- **Response:**
  - `200 OK`: Returns the product with the updated street address.
  - `404 Not Found`: If the product with the given ID is not found or has been deleted.
  - `400 Bad Request`: If the `street` value is invalid or if additional fields are provided.

### 6. Delete Product
- **Description:** Soft delete a product by its ID. The product will be moved to `delete.json`.
- **URL Parameters:**
  - `id`: The ID of the product.
- **Response:**
  - `200 OK`: Confirmation message that the product has been soft deleted.
  - `404 Not Found`: If the product with the given ID is not found or has already been deleted.


## Middlewares
1. Request Logger
   -Logs details of incoming requests, including HTTP method, URL, status code, and response time. This middleware helps in tracking the API usage and debugging issues.
*Example Log Entry*
[INFO] [2024-09-02T15:30:00Z] [GET] /api/crud 200 OK 123ms

2. validateProduct for POST request

* Description: Validates the stock and price fields in the request body for creating products.

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

