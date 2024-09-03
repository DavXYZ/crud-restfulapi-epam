import express, { Request, Response } from 'express';
import CrudService from '../services/crudService';
import ProductModel from '../models/productModel';

export default class CrudController{
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const data = await CrudService.getAllProducts();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const advancedUrl = `${req.protocol}://${req.get('host')}/api/products`;

      if (Array.isArray(data)) {
        const productsWithLinks = data.map(product => ({
          ...product,
          _links: {
            self: { href: `${baseUrl}/${product.id}` },
            update: { href: `${baseUrl}/${product.id}`, method: 'PUT' },
            delete: { href: `${baseUrl}/${product.id}`, method: 'DELETE' },
            getById: { href: `${advancedUrl}/${product.id}`,method:"GET"},
            softDelete: { href: `${advancedUrl}/${product.id}`, method:"DELETE" },
            updateStreet: { href: `${advancedUrl}/${product.id}`, method:"PUT" },
          },
        }));
        res.status(200).json(productsWithLinks);
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
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
            deleted: newData.deleted || false,
            manufacturer: newData.manufacturer || { address: { street: '' } }
        };

        const createdProduct = await CrudService.addProduct(product);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const advancedUrl = `${req.protocol}://${req.get('host')}/api/products`;
        
        res.status(201).json({
            message: 'The new product was added successfully',
            addedProduct: createdProduct,
            _links: {
                self: { href: `${baseUrl}/${createdProduct.id}` },
                delete: { href: `${baseUrl}/${createdProduct.id}`, method: "DELETE" },
                update: { href: `${baseUrl}/${createdProduct.id}`, method: "PUT" },
                getById: { href: `${advancedUrl}/${createdProduct.id}`, method: "GET" },
                softDelete: { href: `${advancedUrl}/${createdProduct.id}`, method: "DELETE" },
                updateStreet: { href: `${advancedUrl}/${createdProduct.id}`, method: "PUT" },
            },
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
}


  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const updatedData: Partial<ProductModel> = req.body;
      const updatedProduct = await CrudService.updateProduct(id, updatedData);

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const advancedUrl = `${req.protocol}://${req.get('host')}/api/products`;

      if (!updatedProduct) {
        res.status(404).json({ message: `Product with id ${id} not found` });
        return;
      }

      res.status(200).json({
        message: `The product with id ${id} was updated successfully`,
        product: updatedProduct,
        _links: {
          self: { href: `${baseUrl}/${id}` },
          delete: { href: `${baseUrl}/${id}`, method: 'DELETE' },
          getById: { href: `${advancedUrl}/${updatedProduct.id}`,method:"GET"},
          softDelete: { href: `${advancedUrl}/${updatedProduct.id}`, method:"DELETE" },
          updateStreet: { href: `${advancedUrl}/${updatedProduct.id}`, method:"PUT" },
        },
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedProduct = await CrudService.deleteProduct(id);

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      if (!deletedProduct) {
        res.status(404).json({ message: `Product with id ${id} not found` });
        return;
      }

      res.status(200).json({
        message: `The product with id ${id} was deleted successfully`,
        product: deletedProduct,
        _links: {
          allProducts: { href: baseUrl },
        },
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
  }
}
