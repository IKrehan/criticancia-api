import { Request, Response } from 'express';
import News from '../services/News';

import ScrapingServices from "../services/Scraping";

class UserController {
    public async getPosts(req: Request, res: Response) {
        try {
            const scrapedPosts = await ScrapingServices.getPostsJN();

            for (const post of scrapedPosts) {
                await News.store(post)
            }

            return res.status(200).send(scrapedPosts);
        } catch (err) {
            return res.status(404).send(err.message);
        }
    }

};


export default new UserController();
