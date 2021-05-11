import axios from "axios";
import Cheerio from "cheerio";
import { ICategory } from "../models/Category";
import { INews } from '../models/News';
import Category from "./Category";
import News from "./News";

class Scraping {

    async getContent(url) {
        const { data: html } = await axios.get(url);
        const $ = Cheerio.load(html);

        const $element = $('.post-content');
        const content = $element.find('.content').text().trim();

        return content;
    }

    async getPosts() {
        const DbCategories = (await Category.index()).data as ICategory[];
        const validCategories = DbCategories.map((category) => category.path);

        const DBNews = (await News.index()).data as INews[];
        const DbUrls = DBNews.map((news) => news.url);

        const posts = [];

        let [total, current] = [validCategories.length - 1, 0];
        for (const category of validCategories) {
            process.stdout.write('\r[Web Scraping] Scraping Categories Posts ' + `${current++}/${total}`);

            const { data: html } = await axios.get('https://jovemnerd.com.br/bunker/categoria' + category);
            if (!html) continue;

            const $ = Cheerio.load(html);

            $('.card-post').each((index, element) => {
                const $element = $(element);
                const url = $element.find('.image').attr('href');
                const title = $element.find('.info .title a').text().trim();
                const category = $element.find('.info a').text().trim().split('\n')[0];
                const thumbnail = $element.find('a img').attr('src');

                if (!(DbUrls.includes(url)) && !(posts.map((post) => post.url).includes(url))) {
                    posts.push({
                        url,
                        title,
                        category,
                        thumbnail,
                        content: '',
                    })
                }
            })
        }
        console.log(`\n[Web Scraping] ${current++}/${total} Scrapped Categories Posts`);

        [total, current] = [posts.length - 1, 0];
        for (const post of posts) {
            posts[current].content = await this.getContent(post.url)
            process.stdout.write('\r[Web Scraping] Scraping Posts Content ' + `${current++}/${total}`);
        }
        console.log(`\n[Web Scraping] ${current++}/${total} Scrapped Posts Content`)

        return posts;
    }
}

export default new Scraping();
