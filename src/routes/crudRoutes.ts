import express from 'express';
import CrudController from '../controllers/crudController'
import requestLogger from '../middlewares/requestLogger';
const router = express.Router();

router.use(requestLogger);

router.get('/', CrudController.getAllProducts);
router.post('/', CrudController.addProduct);
router.put('/:id', CrudController.updateProduct);
router.delete('/:id', CrudController.deleteProduct);

export default router;