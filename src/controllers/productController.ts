import { Request, Response } from 'express';
import ProductService from '../services/productService';
import ProductModel from '../models/productModel';

export default class ProductController {
  
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category?.toString().toLowerCase().trim().replace(/\s+/g, "");
  
      let products: ProductModel[] = await ProductService.getProducts();
      if (category) {
        products = products.filter(product => 
          product.category.toLowerCase().trim().replace(/\s+/g, "") === category
        );
      }
  
      if (products.length === 0) {
        res.status(404).json({ message: category 
          ? `No products found for category '${category}'` 
          : `No products found.` 
        });
        return;
      }
  
      const productsWithLinks = products.map(product => ({
        ...product
      }));
  
      res.status(200).json(productsWithLinks);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data = await ProductService.getProductById(id);

      if (!data) {
        res.status(404).json({ message: `Product with id ${id} not found` });
        return;
      }

      res.status(200).json({
        product: data
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
      
      res.status(200).json({
        message: `Product with id ${id} has been soft deleted and moved to delete.json.`
      });
    } catch (error) {
      console.error('Error soft deleting product:', error);
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
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
        message:`The manufacturer.address.street updated successfully.`,
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product street:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  static async addProduct(req: Request, res: Response): Promise<void> {
    try {
        const allowedKeys: Array<keyof ProductModel> = [
            'id', 'name', 'description', 'price', 'category', 'stock', 
            'tags', 'rating', 'deleted', 'manufacturer'
        ];

        const newData: Partial<ProductModel> = req.body;
        const receivedKeys = Object.keys(newData) as Array<keyof ProductModel>;
        const extraKeys = receivedKeys.filter(key => !allowedKeys.includes(key));

        if (extraKeys.length > 0) {
             res.status(400).json({ 
                message: `Unrecognized keys present: ${extraKeys.join(', ')}`
            });
            return;
        }

        const product: ProductModel = {
            id: newData.id || '',
            name: newData.name || '',
            description: newData.description || '',
            price: newData.price || 0,
            category: newData.category || '',
            stock: newData.stock || { available: 0, reserved: 0, location: '' },
            tags: newData.tags || [],
            rating: newData.rating || 0,
            deleted: false,
            manufacturer: newData.manufacturer || { address: { street: '' } }
        };

        const createdProduct = await ProductService.addProduct(product);

        
        res.status(201).json({
            message: 'The new product was added successfully',
            addedProduct: createdProduct
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
}
static async updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const id: string = req.params.id;
    const updatedData: Partial<ProductModel> = req.body;
    const updatedProduct = await ProductService.updateProduct(id, updatedData);

    if (!updatedProduct) {
      res.status(404).json({ message: `Product with id ${id} not found` });
      return;
    }

    res.status(200).json({
      message: `The product with id ${id} was updated successfully`,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message || 'Internal server error' });
  }
}
}