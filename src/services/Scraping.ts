import axios from "axios";
import Cheerio from "cheerio";
import { INews } from '../models/News';
import News from "./News";

class Scraping {

    private async getUrlsCategoriesImgs() {
        const { data: html } = await axios.get('https://jovemnerd.com.br/');
        const $ = Cheerio.load(html);

        const urls: string[] = [];
        const categories: string[] = [];
        const thumbnails: string[] = [];
        $('.card-post').each((index, element) => {
            const $element = $(element);
            const url = $element.find('a').attr('href');
            urls.push(url)

            const category = $element.find('.info a').text().trim().split('\n')[0];
            categories.push(category)

            const thumbnail = $element.find('a img').attr('src');
            thumbnails.push(thumbnail)
        })
        return { urls, categories, thumbnails };
    }

    public async getPostsJN() {
        const info = await this.getUrlsCategoriesImgs();
        const posts: INews[] = [];
        const total = info.urls.length;
        let current = 0;
        process.stdout.write(`Scraping Posts: ${current}/${total}`);
        for (const url of info.urls) {
            const { data: html } = await axios.get(url);
            const $ = Cheerio.load(html);

            $('.post-content').each((index, element) => {
                const $element = $(element);
                const title = $element.find('.header .title').text().trim();
                const content = $element.find('.content').text().trim();

                posts.push({
                    url: info.urls[index],
                    thumbnail: info.thumbnails[index],
                    title,
                    category: info.categories[index],
                    content
                })
            })
            current++;
            process.stdout.write("\r" + `Scraping Posts: ${current}/${total}`);
        }
        return posts;
    }
}

export default new Scraping();
