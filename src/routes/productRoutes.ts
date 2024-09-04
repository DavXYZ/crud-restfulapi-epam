import express from 'express';
import ProductController from '../controllers/productController'
import { validateProductInput } from '../middlewares/validation/validateProduct';
import requestLogger from '../middlewares/requestLogger';

const router = express.Router();
router.use(requestLogger);

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', validateProductInput, ProductController.addProduct);
router.put('/:id', ProductController.updateProduct);
router.patch('/:id',ProductController.updateProductStreet);
router.delete('/:id', ProductController.softDeleteProduct);

export default router;