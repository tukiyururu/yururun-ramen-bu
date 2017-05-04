declare namespace NodeJS {
    export interface Global {
        setDailyTrigger: () => void;
        twitterAuthorizeCallback: (request: object) => GoogleAppsScript.HTML.HtmlOutput;
        twitterAuthorizeUrl: () => void;
        twitterAuthorizeClear: () => void;
        twitterDailyUpdate: () => void;
        twitterHashtagRetweet: () => void;
    }
}

declare namespace TwitterJSON {
    export interface Status {
        id_str: string;
        text: string;
        user: User;
        retweeted_status: User | undefined;
    }

    export interface User {
        id_str: string;
        screen_name: string;
    }
}

interface TwitterParams {
    [key: string]: string;
}

interface FetchOptions {
    method: "get" | "post";
    muteHttpExceptions: true;
    payload?: string
}
