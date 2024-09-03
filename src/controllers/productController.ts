import { Request, Response } from 'express';
import ProductService from '../services/productService';
import ProductModel from '../models/productModel';

export default class ProductController {
  static async getAllProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category?.toString().toLowerCase().trim().replace(/\s+/g, "");
      if(!category || category === ""){
        res.status(404).json({ message: `Category query parameter is required.` });
        return;
      }
      let products: ProductModel[] = await ProductService.getAllProducts();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const crudUrl = `${req.protocol}://${req.get('host')}/api/crud`;
      if (category) {
        products = products.filter(product => 
          product.category.toLowerCase().trim().replace(/\s+/g, "") === category
        );
      }
      if(products.length === 0){
        res.status(404).json({ message: `No products found for category: '${category}'` });
        return;
      }
      const productsWithLinks = products.map(product => ({
        ...product,
        _links: {
          update: { href: `${crudUrl}/${product.id}`, method: 'PUT' },
          delete: { href: `${crudUrl}/${product.id}`, method: 'DELETE' },
          getById: { href: `${baseUrl}/${product.id}`,method:"GET"},
          softDelete: { href: `${baseUrl}/${product.id}`, method:"DELETE" },
          updateStreet: { href: `${baseUrl}/${product.id}`, method:"PUT" },
        },
      }));

      res.status(200).json(productsWithLinks);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateProductStreet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { street } = req.body;
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const crudUrl = `${req.protocol}://${req.get('host')}/api/crud`;

      const allowedKeys = ['street'];
      const providedKeys = Object.keys(req.body);
      const invalidKeys = providedKeys.filter(key => !allowedKeys.includes(key));

      if (invalidKeys.length > 0) {
        res.status(400).json({ message: `Invalid fields provided: ${invalidKeys.join(', ')}` });
        return;
      }

      if (!street || typeof street !== 'string') {
        res.status(400).json({ message: 'Invalid street value. It must be a non-empty string.' });
        return;
      }

      const updatedProduct = await ProductService.updateProductStreet(id, street);

      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found or has been deleted.' });
        return;
      }

      res.status(200).json({
        product: updatedProduct,
        _links: {
          update: { href: `${crudUrl}/${id}`, method: 'PUT' },
          delete: { href: `${crudUrl}/${id}`, method: 'DELETE' },
          getById: { href: `${baseUrl}/${id}`,method:"GET"},
          softDelete: {href: `${baseUrl}/${id}`, method: 'DELETE', message: "Soft Delete"}
        },
      });
    } catch (error) {
      console.error('Error updating product street:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data = await ProductService.getProductById(id);
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const crudUrl = `${req.protocol}://${req.get('host')}/api/crud`;

      if (!data) {
        res.status(404).json({ message: `Product with id ${id} not found` });
        return;
      }

      res.status(200).json({
        product: data,
        _links: {
          update: { href: `${crudUrl}/${id}`, method: 'PUT' },
          delete: { href: `${crudUrl}/${id}`, method: 'DELETE' },
          updateStreet: {href: `${baseUrl}/${id}`, method: 'PUT' ,message:"Update Street Information"},
          softDelete: {href: `${baseUrl}/${id}`, method: 'DELETE', message: "Soft Delete"}
        },
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
  }

  static async softDeleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await ProductService.getProductById(id);

      if (!product) {
        res.status(404).json({ message: 'Product not found or has already been deleted.' });
        return;
      }

      await ProductService.softDeleteProduct(id);
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const crudUrl = `${req.protocol}://${req.get('host')}/api/crud`;
      res.status(200).json({
        message: `Product with id ${id} has been soft deleted and moved to delete.json.`,
        _links: {
          advancedProducts: { href: baseUrl },
          crud: { href: crudUrl },
        },
      });
    } catch (error) {
      console.error('Error soft deleting product:', error);
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
  }
}
