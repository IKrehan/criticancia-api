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

    public async index(category = null, pagination: { perPage?: number, currentPage?: number } | null = null): Promise<IResponse> {
        try {
            let newsIndex = [];
            if (!category) {
                newsIndex = await News.findAll({
                    attributes: { exclude: ['categoryId'] },
                    include: 'category',
                    ...pagination
                });
            } else {
                const categoryRow = await Category.findOne({ where: { path: `/${category}` } });

                if (!categoryRow)
                    return { success: false, status: 404, message: "Invalid Category" };

                newsIndex = await News.findAll({
                    where: { categoryId: categoryRow.id },
                    attributes: { exclude: ['categoryId'] },
                    include: 'category',
                    ...pagination
                });
            }

            const totalNews = await News.count();

            if (!newsIndex)
                return { success: false, status: 404, message: "News cannot be find" };

            return {
                success: true, status: 201, message: "News found!",
                data: {
                    currentPage: pagination?.currentPage,
                    totalPages: Math.ceil(totalNews / pagination?.perPage),
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
            const newsDeleted = await News.findByPk(newsId);
            newsDeleted.destroy();

            return { success: true, status: 200, message: "News deleted!", data: newsDeleted };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async deleteOldNews(toRemain: number): Promise<INews[]> {
        try {
            const newsCount = await News.count()

            if (newsCount <= toRemain) return

            const newsToDelete = await News.findAll({
                order: [
                    ['createdAt', 'ASC']
                ],
                limit: newsCount - toRemain
            })

            const deleted = []
            for (const news of newsToDelete) {
                const del = await this.delete(news.id);
                deleted.push(del.data)
            }
            console.log(deleted.length);

            return deleted
        } catch (error) {
            console.log(error);
        }
    }
}

export default new NewsService();