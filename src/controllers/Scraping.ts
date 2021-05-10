import { Request, Response } from 'express';
import { ICategory } from '../models/Category';
import Category from '../services/Category';
import News from '../services/News';

import ScrapingServices from "../services/Scraping";

class UserController {
    public async getPosts(req: Request, res: Response) {
        try {
            const scrapedPosts = await ScrapingServices.getPosts();

            const total = scrapedPosts.length - 1;
            let current = 0;
            process.stdout.write("\r" + `[Web Scraping] Saving Posts: ${current}/${total}`);
            for (const post of scrapedPosts) {
                const DbCategory = (await Category.getOne(post.category)).data as ICategory

                if (!DbCategory) continue;

                await News.store({ userId: 'c1843686-d749-434e-a53b-223598cc0f04', categoryId: parseInt(DbCategory.id), categoryPath: DbCategory.path, ...post })
                process.stdout.write("\r" + `[Web Scraping] Saving Posts: ${current++}/${total}`);
            }
            console.log(`\n[Web Scraping] ${total} Posts Saved on Database!`);

            return res.status(200).send(scrapedPosts);
        } catch (err) {
            return res.status(404).send(err.message);
        }
    }

};


export default new UserController();
