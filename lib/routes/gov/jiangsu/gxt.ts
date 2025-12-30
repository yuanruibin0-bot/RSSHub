import { Route } from '@/types';
import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

export const route: Route = {
    path: '/jiangsu/gxt',
    categories: ['government'],
    example: '/gov/jiangsu/gxt',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['gxt.jiangsu.gov.cn/col/col89736/index.html'],
        },
    ],
    name: '江苏省工信厅 - 公示公告',
    maintainers: [],
    handler: async (ctx) => {
        const rootUrl = 'http://gxt.jiangsu.gov.cn';
        const currentUrl = `${rootUrl}/col/col89736/index.html`;

        const response = await got({
            method: 'get',
            url: currentUrl,
        });

        const $ = load(response.data);

        const list = $('div.default_pgContainer li')
            .toArray()
            .map((item) => {
                const $item = $(item);
                const a = $item.find('a');
                const date = $item.find('span').text();
                
                let link = a.attr('href');
                if (link && !link.startsWith('http')) {
                    link = new URL(link, rootUrl).href;
                }
                
                return {
                    title: a.attr('title') || a.text(),
                    link: link,
                    pubDate: timezone(parseDate(date), +8),
                };
            });

        return {
            title: '江苏省工信厅 - 公示公告',
            link: currentUrl,
            item: list,
        };
    },
};
