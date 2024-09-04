import { Request, Response, NextFunction } from 'express';
import ProductModel from '..//../models/productModel';

export function validateProductInput(req: Request, res: Response, next: NextFunction): void {
  const { stock, price }: Partial<ProductModel> = req.body;

  if (stock && (typeof stock.available !== 'number' || stock.available < 0 || !Number.isInteger(stock.available))) {
    res.status(400).json({ message: "stock.available must be a non-negative integer." });
    return; 
  }  
  
  if (typeof price !== 'number' || price <= 0) {
    res.status(400).json({ message: "price must be a positive number. " });
    return; 
  }
  next();
}
