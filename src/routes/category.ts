import { Router } from 'express';
import Category from "../controllers/Category";
import verifyToken from '../middlewares/verifyToken';

const router: Router = Router();

router.post('/', verifyToken, Category.store)
router.get('/', Category.index);
router.put('/:id', verifyToken, Category.update);
router.delete('/:id', verifyToken, Category.delete)


export default router;