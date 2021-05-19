import axios from "axios";
import Cheerio from "cheerio";
import { ICategory } from "../models/Category";
import { INews } from '../models/News';
import Category from "./Category";
import News from "./News";

class Scraping {

    async getContent(url) {
        try {
            const { data: html } = await axios.get(url);
            const $ = Cheerio.load(html);

            const $element = $('.post-content');
            const content = $element.find('.content').text().trim();

            return content;
        } catch (error) {
            console.log(error);

        }
    }

    async getPosts() {
        try {
            const DbCategories = (await Category.index()).data as ICategory[];
            const validCategories = DbCategories.map((category) => category.path);

            const DBNews = (await News.index()).data as { currentPage: number; totalPages: number; news: INews[]; };
            const DbUrls = DBNews.news.map((news) => news.url);

            const posts = [];

            let [total, current] = [validCategories.length, 1];
            for (const category of validCategories) {
                const { data: html } = await axios.get('https://jovemnerd.com.br/bunker/categoria' + category);
                if (!html) continue;

                const $ = Cheerio.load(html);

                $('.card-post').each((index, element) => {
                    const $element = $(element);
                    const url = $element.find('.image').attr('href');
                    const title = $element.find('.info .title a').text().trim();
                    const category = $element.find('.info a').text().trim().split('\n')[0];
                    const thumbnail = $element.find('a img').attr('src');

                    const sectionedImageUrl = thumbnail.split('-');
                    const imageSize = sectionedImageUrl[sectionedImageUrl.length - 1].split('.')[0];

                    if (
                        !(DbUrls.includes(url)) &&
                        !(posts.map((post) => post.url).includes(url)) &&
                        imageSize === '760x428'
                    ) {
                        console.log('foi');

                        posts.push({
                            url,
                            title,
                            category,
                            thumbnail,
                            content: '',
                        })
                    }
                })

                process.stdout.write('\r[Web Scraping] Scraping Categories Posts ' + `${current++}/${total}`);
            }
            console.log(`\n`);


            [total, current] = [posts.length, 1];
            const postsWithContent = []
            for (const post of posts) {
                post.content = await this.getContent(post.url);
                postsWithContent.push(post);
                process.stdout.write('\r[Web Scraping] Scraping Posts Content ' + `${current++}/${total}`);
            }
            console.log(`\n`)

            return postsWithContent;

        } catch (error) {
            console.log(error);
        }
    }
}

export default new Scraping();
