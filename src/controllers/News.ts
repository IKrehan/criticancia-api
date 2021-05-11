import { Request, Response } from 'express';
import { INews } from '../models/News';

// import services
import NewsService from "../services/News";

class NewsController {
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
        const { perPage, currentPage } = req.query;
        const userResponse = await NewsService.index(req.query?.category, { perPage: parseInt(perPage as string), currentPage: parseInt(currentPage as string) });

        return res.status(userResponse.status).send(userResponse);
    }

    public async getOne(req: Request, res: Response) {
        const userResponse = await NewsService.getOne(req.params.slugOrId);

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


export default new NewsController();
