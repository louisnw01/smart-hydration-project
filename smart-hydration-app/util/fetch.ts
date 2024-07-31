// TODO server_url should be in .env

export const SERVER_ADDRESS = "localhost:8085";
// export const SERVER_ADDRESS = "hydrationapi.louisnw.com";

export const SERVER_URL = `http${
    SERVER_ADDRESS.includes(".com") ? "s" : ""
}://${SERVER_ADDRESS}`;

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
    USER_INFO: "/user/info",
    DELETE_USER: "/user/delete",
    UPDATE_JUG_NAME: "/jug/update-name",
    USER_EXISTS: "/user/exists",
    ADD_DRINK: "/jug-user/add-drink-event",
    UPDATE_USER_TARGET: "/user/update-user-target",

    SEND_VERIFICATION_EMAIL: "/user/send-verification-email",

    COMMUNITY_INFO: "/community/info",
    CREATE_COMMUNITY: "/community/create",
    UPDATE_COMMUNITY: "/community/update",
    DELETE_COMMUNITY: "/community/delete",
    COMMUNITY_GENERATE_INVITE: "/community/generate-invite",
    COMMUNITY_USERS: "/community/users",
    DELETE_COMMUNITY_MEMBER: "/community/delete-member",
    PATIENT_INFO: "/community/patient-info", // get the info through this endpoint
    NAME_FROM_LINK: "/community/name-from-link",
    JOIN_COMMUNITY: "/community/join",

    CREATE_JUG_USER: "/jug-user/create",
    VERIFY_EMAIL: "/user/verify",
};

interface RequestOptions {
    method: "get" | "post";
    query: { [key: string]: any };
    body: { [key: string]: any };
    auth?: string;
    rawUrl?: boolean;
}

export async function request(
    endpoint: string,
    options: Partial<RequestOptions>,
) {
    let url = options.rawUrl ? endpoint : SERVER_URL + endpoint;

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
