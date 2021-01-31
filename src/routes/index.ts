import { Router } from 'express';

// import routes
import auth from './auth';
import category from './category';
import news from './news';


const router: Router = Router();

// prefixes
router.use("/auth", auth);
router.use("/category", category);
router.use("/news", news);


export default router;