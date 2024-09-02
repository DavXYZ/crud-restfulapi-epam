import express from 'express';
import ProductController from '../controllers/crudController'
import requestLogger from '../middlewares/requestLogger';
const router = express.Router();
router.use(requestLogger);

router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.addProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;