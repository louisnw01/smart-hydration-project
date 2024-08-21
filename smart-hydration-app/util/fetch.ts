// TODO server_url should be in .env

export const SERVER_ADDRESS = "localhost:8085";
// export const SERVER_ADDRESS = "hydrationapi.louisnw.com";

export const SERVER_URL = `http${
    SERVER_ADDRESS.includes(".com") ? "s" : ""
}://${SERVER_ADDRESS}`;

export const ENDPOINTS = {
    HELLO_WORLD: "/",
    DEVICE_INFO: "/data/latest",
    LOGIN: "/user/login",
    REGISTER: "/user/register",

    FETCH_HISTORICAL_JUG_DATA: "/data/historical",
    GET_ALL_JUGS: "/get-all-jugs",
    USER_INFO: "/user/info",
    DELETE_USER: "/user/delete",
    UPDATE_JUG_NAME: "/jug/update-name",
    USER_EXISTS: "/user/exists",
    ADD_DRINK: "/jug-user/add-drink",
    UPDATE_USER_TARGET: "/user/update-user-target",
    ADD_TAGS_PATIENT: "/jug-user/add-tags-patient",

    UNLINK_JUG: "/jug/unlink",
    LINK_JUG: "/jug/link",

    SEND_VERIFICATION_EMAIL: "/user/send-verification-email",

    COMMUNITY_INFO: "/community/info",
    CREATE_COMMUNITY: "/community/create",
    JOIN_COMMUNITY: "/community/join",
    UPDATE_COMMUNITY: "/community/update",
    DELETE_COMMUNITY: "/community/delete",
    LEAVE_COMMUNITY: "/community/leave",
    COMMUNITY_GENERATE_INVITE: "/community/generate-invite",
    COMMUNITY_USERS: "/community/users",
    DELETE_COMMUNITY_MEMBER: "/community/delete-member",
    PATIENT_INFO: "/community/patient-info", // get the info through this endpoint

    CREATE_TAG: "/community/create-tag",
    UPDATE_TAG: "/community/update-tag",
    DELETE_TAG: "/community/delete-tag",
    COMMUNITY_TAGS: "/community/get-tags",
    REMOVE_PATIENT: "/community/remove-patient",

    NAME_FROM_LINK: "/community/name-from-link",

    CREATE_JUG_USER: "/jug-user/create",
    VERIFY_EMAIL: "/user/verify",

    ADD_PUSH_TOKEN: "/user/add-push-token",
    REMOVE_PUSH_TOKEN: "/user/remove-push-token",
    TOGGLE_NOTIFICATIONS: "/user/toggle-notifications",
    TOGGLE_NOTIFICATIONS_FREQUENCY: "/user/toggle-notifications-frequency",

    CHANGE_MODE: "/user/change-mode",

    ADD_CUSTOM_CUP: "/user/add-custom-cup",
    GET_CUSTOM_CUPS: "/user/get-custom-cups",
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
