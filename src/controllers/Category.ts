import { Request, Response } from 'express';

// import services
import CategoryService from "../services/Category";

class UserController {
    public async store(req: Request, res: Response) {
        const userResponse = await CategoryService.store(req.body);

        return res.status(userResponse.status).send(userResponse);
    }

    public async index(req: Request, res: Response) {
        const userResponse = await CategoryService.index();

        return res.status(userResponse.status).send(userResponse);
    }

    public async update(req: Request, res: Response) {
        const userResponse = await CategoryService.update(req.params.id, req.body);

        return res.status(userResponse.status).send(userResponse);
    }

    public async delete(req: Request, res: Response) {
        const userResponse = await CategoryService.delete(req.params.id);

        return res.status(userResponse.status).send(userResponse);
    }

};


export default new UserController();
