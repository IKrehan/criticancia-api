import { Router } from 'express';

// import routes
import auth from './auth';

const router: Router = Router();

// prefixes
router.use("/auth", auth);


export default router;