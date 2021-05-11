import User from '../models/User';
import News, { INews } from '../models/News'
import Category from '../models/Category';

interface IResponse {
    success: boolean;
    status: number;
    message: string;
    data?: {
        currentPage: number;
        totalPages: number;
        news: INews[];
    } | INews | INews[];
}

class NewsService {
    public async store(news: INews): Promise<IResponse> {
        try {
            const newsCreated = await News.create(news);

            if (!newsCreated) {
                return { success: false, status: 404, message: "News cannot be create" };
            }

            return { success: true, status: 201, message: "News created!", data: newsCreated };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }

    }

    public async index(query): Promise<IResponse> {
        try {
            const category = await Category.findOne({ where: { path: `/${query.category}` } });
            let newsIndex = await News.findAll(query ? {
                where: { categoryId: category.id },
                limit: query.perPage,
                offset: query.perPage * query.currentPage,
                attributes: { exclude: ['categoryId'] },
                include: 'category',
            } : {
                attributes: { exclude: ['categoryId'] },
                include: 'category'
            });
            const totalNews = await News.count();

            if (!newsIndex)
                return { success: false, status: 404, message: "News cannot be find" };

            return {
                success: true, status: 201, message: "News found!",
                data: {
                    currentPage: parseInt(query.currentPage) || 0,
                    totalPages: Math.ceil(totalNews / query.perPage) || 0,
                    news: newsIndex
                }
            };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async getOne(slug: string): Promise<IResponse> {
        try {
            const news = await News.findOne({ where: { slug: slug } });

            return { success: true, status: 201, message: "News found!", data: news };
        } catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async update(newsId: string, newsAttributtes: INews): Promise<IResponse> {
        try {
            const newsUpdate = await News.findByPk(newsId)

            await newsUpdate.update(newsAttributtes);
            return { success: true, status: 201, message: "News successfully updated!", data: newsUpdate };
        }
        catch (err) {
            console.log(err);
            return { success: false, status: 404, message: "Unknown error" };
        }

    }

    public async delete(newsId): Promise<IResponse> {
        try {
            const newsDeleted = await News.findByPk(newsId)

            return { success: true, status: 200, message: "News deleted!", data: newsDeleted };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }
}

export default new NewsService();
