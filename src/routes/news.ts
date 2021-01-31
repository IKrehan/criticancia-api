import { Router } from 'express';
import News from "../controllers/News";
import verifyToken from '../middlewares/verifyToken';

const router: Router = Router();

router.post('/', verifyToken, News.store)
router.get('/', News.index);
router.put('/:id', verifyToken, News.update);
router.delete('/:id', verifyToken, News.delete)


export default router;