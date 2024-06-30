// TODO server_url should be in .env
const SERVER_URL = "http://localhost:8085";
// const SERVER_URL = "http://18.133.247.202";

export const ENDPOINTS = {
    HELLO_WORLD: "/",
    FETCH_COMMUNITY: "/community-jug-status",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_ALL_JUGS: "/get-all-jugs",
};

interface RequestOptions {
    method: "get" | "post";
    query: { [key: string]: any };
    body: { [key: string]: any };
    auth?: string;
}

export async function request(
    endpoint: string,
    options: Partial<RequestOptions>,
) {
    let url = SERVER_URL + endpoint;

    if (options.query) {
        url += "?";
        let isFirstEntry = true;
        for (const [key, val] of Object.entries(options.query)) {
            if (!isFirstEntry) {
                url += "&";
            } else {
                isFirstEntry = false;
            }
            url += `${key}=${val}`;
        }
    }

    let headers = { "Content-Type": "application/json" };

    if (options.auth) {
        headers = {
            ...headers,
            ...{ Authorization: `Bearer ${options.auth}` },
        };
    }

    const result = await fetch(url, {
        method: options.method || "get",
        body: JSON.stringify(options.body),
        headers: headers,
    });

    return result;
}
