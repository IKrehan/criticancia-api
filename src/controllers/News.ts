import { Request, Response } from 'express';
import { INews } from '../models/News';

// import services
import NewsService from "../services/News";

class UserController {
    public async store(req: Request, res: Response) {
        const { thumbnail, title, content, categoryId } = req.body

        const newsAttributes: INews = {
            thumbnail,
            title,
            content,
            categoryId: categoryId,
            userId: req.currentUserId,
        }

        const userResponse = await NewsService.store(newsAttributes);

        return res.status(userResponse.status).send(userResponse);
    }

    public async index(req: Request, res: Response) {
        const userResponse = await NewsService.index(req.body.category ? req.body.category : '');

        return res.status(userResponse.status).send(userResponse);
    }

    public async update(req: Request, res: Response) {
        const userResponse = await NewsService.update(req.params.id, req.body);

        return res.status(userResponse.status).send(userResponse);
    }

    public async delete(req: Request, res: Response) {
        const userResponse = await NewsService.delete(req.params.id);

        return res.status(userResponse.status).send(userResponse);
    }
};


export default new UserController();
