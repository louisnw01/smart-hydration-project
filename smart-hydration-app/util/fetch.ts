// TODO server_url should be in .env
const SERVER_URL = 'http://localhost:8085';


export const ENDPOINTS = {
    HELLO_WORLD: '/',
    FETCH_COMMUNITY: '/community-jug-status',
}


interface RequestOptions {
    method: 'get' | 'post',
    query: {[key: string]: any},
    body: {[key: string]: any},
}

export async function request(endpoint: string, options: Partial<RequestOptions>){
    let url = SERVER_URL+endpoint;

    if (options.query) {
        url += '?';
        let isFirstEntry = true;
        for (const [key, val] of Object.entries(options.query)) {
            if (!isFirstEntry) {
                url += '&';
            } else {
                isFirstEntry = false;
            }
            url += `${key}=${val}`
        }
    }

    const result = await fetch(url, {
        method: options.method || 'get',
        body: JSON.stringify(options.body),
    });

    return result;
}