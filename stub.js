import {v4} from 'uuid';

export function generateNews(page) {
    let number = page ? Number.parseInt(page) : 1;
    let newsPage = {
        content: [],
        hasNext: number < 3,
        totalPages: 3,
        number: number
    };
    for (let i = 0; i < 20; i++) {
        newsPage.content.push({id: v4(), title: 'Title ' + v4()})
    }
    return newsPage;
}