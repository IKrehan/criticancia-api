import { Router } from 'express';
import ScrapingServices from "../controllers/Scraping";

const router: Router = Router();

router.get('/', ScrapingServices.getPosts)



export default router;