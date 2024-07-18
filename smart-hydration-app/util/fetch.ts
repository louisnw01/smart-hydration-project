// TODO server_url should be in .env

export const SERVER_URL = "http://localhost:8085";
// export const SERVER_URL = "https://hydrationapi.louisnw.com";

export const ENDPOINTS = {
    HELLO_WORLD: "/",
    FETCH_COMMUNITY: "/data/latest",
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    UNLINK_JUG_FROM_USER: "/user/unlink-jug",
    LINK_JUG_TO_USER: "/user/link-jug",
    FETCH_HISTORICAL_JUG_DATA: "/data/historical",
    GET_ALL_JUGS: "/get-all-jugs",
    UPDATE: "/jug-user/update",
    FETCH_USER: "/user/user-name",
    DELETE_USER: "/user/delete",
    UPDATE_JUG_NAME: "/jug/update-name",
    USER_EXISTS: "/user/exists",
    ADD_DRINK: "/jug-user/add-drink-event",

    CREATE_COMMUNITY: "/community/create",
    UPDATE_COMMUNITY: "/community/update",
    DELETE_COMMUNITY: "/community/delete",

    CREATE_JUG_USER: "/jug-user/create",
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
