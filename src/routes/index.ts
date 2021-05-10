import { Router } from 'express';

// import routes
import auth from './auth';
import category from './category';
import news from './news';
import scraping from './scraping';


const router: Router = Router();

// prefixes
router.use("/auth", auth);
router.use("/category", category);
router.use("/news", news);
router.use("/scraping", scraping);


export default router;