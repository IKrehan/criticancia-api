import { Router } from 'express';
import Auth from "../controllers/Auth";

const router: Router = Router();
router.post('/signup', Auth.signUp)

router.post('/signin', Auth.signIn);
router.get('/signout', Auth.signOut);

router.get('/token', Auth.refreshToken)


export default router;