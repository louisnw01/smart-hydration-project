// TODO server_url should be in .env

const SERVER_URL = "http://localhost:8085";
// const SERVER_URL = "https://hydrationapi.louisnw.com";

export const ENDPOINTS = {
    HELLO_WORLD: "/",
    FETCH_COMMUNITY: "/community-jug-status",
    LOGIN: "/login",
    REGISTER: "/register",
    UNLINK_JUG_FROM_USER: "/unlink-jug-from-user",
    LINK_JUG_TO_USER: "/link-jug-to-user",
    FETCH_HISTORICAL_JUG_DATA: "/historical-jug-data",
    GET_ALL_JUGS: "/get-all-jugs",
    UPDATE: "/update",
    FETCH_USER: "/user",
    GET_TODAYS_INTAKE: "/todays-total-intake",
    UPDATE_JUG_NAME: "/update-jug-name",
    USER_EXISTS: "/user-exists",
    ADD_DRINK: "/add-drink-event",
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
