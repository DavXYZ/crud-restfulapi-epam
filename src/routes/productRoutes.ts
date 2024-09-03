import express from 'express';
import ProductController from '../controllers/productController'
import CrudController from '../controllers/crudController';
import { validateProductInput } from '../middlewares/validation/validateProduct';
import requestLogger from '../middlewares/requestLogger';
const router = express.Router();

router.use(requestLogger);

router.get('/:id', ProductController.getProductById);
router.get('/', ProductController.getAllProductsByCategory);
router.post('/', validateProductInput, CrudController.addProduct);
router.put('/:id/', ProductController.updateProductStreet);
router.delete('/:id', ProductController.softDeleteProduct);

export default router;