import { Router } from 'express';

// import routes


const router: Router = Router();

// prefixes
router.use("/", (req, res) => {
    res.send('Hello World')
});


export default router;