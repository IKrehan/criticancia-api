import User from '../models/User';
import News, { INews } from '../models/News'
import Category from '../models/Category';

interface IResponse {
    success: boolean;
    status: number;
    message: string;
    data?: INews | INews[];
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

    public async index(category=''): Promise<IResponse> {
        try {
            let newsIndex: INews[] = [];

            if (category) {
                const categoryType = await Category.findOne({ where: { path: '/'+category } });
                newsIndex = await News.findAll({ where: { categoryId: categoryType.id } });

            } else {
                newsIndex = await News.findAll();
            }

            if (!newsIndex) {
                return { success: false, status: 404, message: "News cannot be find" };
            }

            return { success: true, status: 201, message: "News found!", data: newsIndex };
        }
        catch (err) {
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