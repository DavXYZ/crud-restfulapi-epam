import fs from 'fs-extra';
import path from 'path';
import ProductModel from '../models/productModel';

export default class ProductService {
  private static productsFilePath = path.join(__dirname, '../products.json');

  private static async readProducts(): Promise<ProductModel[]> {
    try {
      const data = await fs.readFile(this.productsFilePath, 'utf-8');
      return JSON.parse(data).products;
    } catch (error) {
      console.error('Error reading products:', error);
      throw new Error('Failed to read products');
    }
  }

  private static async writeProducts(products: ProductModel[]): Promise<void> {
    try {
      await fs.writeFile(this.productsFilePath, JSON.stringify({ products }, null, 2));
    } catch (error) {
      console.error('Error writing products:', error);
      throw new Error('Failed to write products');
    }
  }

  static async getAllProducts(): Promise<ProductModel[] | { message: string }> {
    try {
        const products = await this.readProducts();
        const nonDeletedProducts = products.filter(product => !product.deleted);

        if (nonDeletedProducts.length === 0) {
            return { message: 'The database is empty' };
        }
        return nonDeletedProducts;
    } catch (error) {
        console.error('Error getting all products:', error);
        return { message: 'Failed to get products. Please try again later.' };
    }
}
  static async addProduct(newProduct: ProductModel): Promise<ProductModel> {
    try {
        const products = await this.readProducts();
        const requiredFields: (keyof Omit<ProductModel, 'id'>)[] = [
            'name', 'description', 'price', 'category', 'stock', 'tags', 'rating'
        ];

        const missingFields = requiredFields.filter(field => newProduct[field] === undefined);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (newProduct.id) {
          
            if (parseInt(newProduct.id, 10) <= 0) {
                throw new Error('Invalid ID: ID must be a positive number');
            }

            const existingProduct = products.find(product => product.id === newProduct.id);
            if (existingProduct) {
                throw new Error('ID already exists: A product with this ID already exists');
            }
        } else {
            newProduct.id = (products.length ? (parseInt(products[products.length - 1].id, 10) + 1).toString() : '1');
        }

        products.push(newProduct);
        return newProduct;
        await this.writeProducts(products);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding product:', error.message);
            throw new Error(`Failed to add product: ${error.message}`);
        } else {
            console.error('An unknown error occurred while adding the product');
            throw new Error('Failed to add product due to an unknown error');
        }
    }
}


  static async updateProduct(id: string, updatedData: Partial<ProductModel>): Promise<ProductModel | undefined> {
    try {
        if (Object.keys(updatedData).length === 0) {
            throw new Error('No data provided for update');
        }

        let products = await this.readProducts();
        products = products.filter(product => !product.deleted);
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.warn(`Product with id ${id} not found for update`);
            return undefined;
        }

        const validKeys: (keyof ProductModel)[] = [
            'name', 'description', 'price', 'category', 'stock', 'tags', 'rating', 'manufacturer'
        ];

        const filteredData = Object.keys(updatedData).reduce<Partial<ProductModel>>((acc, key) => {
            const typedKey = key as keyof ProductModel;

            if (validKeys.includes(typedKey)) {
                acc[typedKey] = updatedData[typedKey] as any;
            } else {
                throw new Error(`Invalid field '${key}' provided for update`);
            }
            return acc;
        }, {});

        const updatedProduct = { ...products[productIndex], ...filteredData };
        products[productIndex] = updatedProduct;

        await this.writeProducts(products);
        return updatedProduct;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error updating product with id ${id}:`, error.message);
            throw new Error(`Failed to update product with id ${id}: ${error.message}`);
        } else {
            console.error('An unknown error occurred during product update');
            throw new Error('Failed to update product due to an unknown error');
        }
    }
}



  static async deleteProduct(id: string): Promise<ProductModel | void> {
    try {
      const products = await this.readProducts();
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex === -1) {
        console.warn(`Product with id ${id} not found for deletion`);
        return; 
      }

      const updatedProducts = products.filter(product => product.id !== id);
      const deletedData = products[productIndex];
      
      await this.writeProducts(updatedProducts);
      return deletedData;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error(`Failed to delete product with id ${id}`);
    }
  }

 
}
