import fs from 'fs-extra';
import path from 'path';
import ProductModel from '../models/productModel';

export default class ProductService {
  private static productsFilePath = path.join(__dirname, '../products.json');
  
  private static deletedProductsFilePath = path.join(__dirname, '../delete.json');

  private static async readProducts(): Promise<ProductModel[]> {
    try {
      const data = await fs.readFile(this.productsFilePath, 'utf-8');
      return JSON.parse(data).products;
    } catch (error) {
      console.error('Error reading products from file:', error);
      throw new Error('Failed to read products');
    }
  }

  private static async writeProducts(products: ProductModel[]): Promise<void> {
    try {
      await fs.writeFile(this.productsFilePath, JSON.stringify({ products }, null, 2));
    } catch (error) {
      console.error('Error writing products to file:', error);
      throw new Error('Failed to write products');
    }
  }

  private static async appendDeletedProduct(deletedProduct: ProductModel): Promise<void> {
    try {
      const deletedProducts = await this.readDeletedProducts();
      deletedProducts.push(deletedProduct);
      await fs.writeFile(this.deletedProductsFilePath, JSON.stringify({ deletedProducts }, null, 2));
    } catch (error) {
      console.error('Error appending deleted product to file:', error);
      throw new Error('Failed to append deleted product');
    }
  }

  private static async readDeletedProducts(): Promise<ProductModel[]> {
    try {
      const data = await fs.readFile(this.deletedProductsFilePath, 'utf-8');
      return JSON.parse(data).deletedProducts;
    } catch (error) {
      console.warn('Deleted products file not found or empty. Creating a new one.');
      return [];
    }
  }

  static async getAllProducts(): Promise<ProductModel[]> {
    try {
      const products = await this.readProducts();
      return products.filter(product => !product.deleted);
    } catch (error) {
      console.error('Error getting all products:', error);
      throw new Error('Failed to get all products');
    }
  }

  static async updateProductStreet(id: string, street: string): Promise<ProductModel | undefined> {
    try {
      const products = await this.readProducts();
      const productIndex = products.findIndex(product => product.id === id && !product.deleted);

      if (productIndex === -1) {
        console.warn(`Product with id ${id} not found or has been deleted.`);
        return undefined; 
      }

      if (!products[productIndex].manufacturer) {
        products[productIndex].manufacturer = { address: { street: '' } };
      }
      if (!products[productIndex].manufacturer.address) {
        products[productIndex].manufacturer.address = { street: '' };
      }
      products[productIndex].manufacturer.address.street = street;
      await this.writeProducts(products);
      return products[productIndex];
    } catch (error) {
      console.error(`Error updating product street for id ${id}:`, error);
      throw new Error(`Failed to update product street for id ${id}`);
    }
  }

  static async softDeleteProduct(id: string): Promise<void> {
    try {
      const products = await this.readProducts();
      const productIndex = products.findIndex(product => product.id === id && !product.deleted);

      if (productIndex === -1) {
        console.warn(`Product with id ${id} not found or has already been deleted.`);
        throw new Error(`Product with id ${id} not found or already deleted.`);
      }

      const deletedProduct = { ...products[productIndex], deleted: true };
      products[productIndex] = deletedProduct;

      await this.appendDeletedProduct(deletedProduct);
      await this.writeProducts(products);
    } catch (error) {
      console.error(`Error soft deleting product with id ${id}:`, error);
      throw new Error(`Failed to soft delete product with id ${id}`);
    }
  }

  static async getProductById(id: string): Promise<ProductModel | undefined> {
    try {
      const products = await this.readProducts();
      const product = products.find(product => product.id === id && !product.deleted);

      if (!product) {
        console.warn(`Product with id ${id} not found or has been deleted.`);
        return undefined; 
      }

      return product;
    } catch (error) {
      console.error(`Error getting product with id ${id}:`, error);
      throw new Error(`Failed to get product with id ${id}`);
    }
  }
}
