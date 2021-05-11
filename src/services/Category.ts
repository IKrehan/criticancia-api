import User from '../models/User';
import Category, { ICategory } from '../models/Category'

interface IResponse {
    success: boolean;
    status: number;
    message: string;
    data?: ICategory | ICategory[];
}

class CategoryService {
    public async store(category: ICategory): Promise<IResponse> {
        try {
            const categoryCreated = await Category.create(category);

            if (!categoryCreated) {
                return { success: false, status: 404, message: "Category cannot be create" };
            }

            return { success: true, status: 201, message: "Category created!", data: categoryCreated };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }

    }

    public async index(): Promise<IResponse> {
        try {
            const categoriesIndex = await Category.findAll();

            if (!categoriesIndex) {
                return { success: false, status: 404, message: "Categories cannot be find" };
            }

            return { success: true, status: 201, message: "Categories found!", data: categoriesIndex };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async getOne(title: string): Promise<IResponse> {
        try {
            const categoryIndex = await Category.findOne({ where: { title } });

            if (!categoryIndex) {
                return { success: false, status: 404, message: "Categories cannot be find" };
            }

            return { success: true, status: 201, message: "Categories found!", data: categoryIndex };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async update(categoryId: string, categoryAttributtes: ICategory): Promise<IResponse> {
        try {
            const userPlatform = await Category.findByPk(categoryId)

            // check if title is already used
            if (categoryAttributtes.title && await Category.findOne({ where: { title: categoryAttributtes.title } })) {
                return { success: false, status: 404, message: "Title is already registered" };
            }

            // check if Path already is used
            if (categoryAttributtes.path && await Category.findOne({ where: { path: categoryAttributtes.path } })) {
                return { success: false, status: 404, message: "Path is already registered" };
            }

            await userPlatform.update(categoryAttributtes);
            return { success: true, status: 201, message: "Category successfully updated!", data: userPlatform };
        }
        catch (err) {
            console.log(err);
            return { success: false, status: 404, message: "Unknown error" };
        }

    }

    public async delete(categoryId): Promise<IResponse> {
        try {
            const categoryDeleted = await Category.findByPk(categoryId)

            return { success: true, status: 200, message: "Category deleted!", data: categoryDeleted };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }
}

export default new CategoryService();