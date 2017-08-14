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
        entities: Entities
    }

    export interface User {
        id_str: string;
        screen_name: string;
    }

    export interface Entities {
        hashtags: Hashtags[]
    }

    export interface Hashtags {
        text: string
    }

    export interface Ids {
        ids: string[];
    }

    export interface Lookup {
        id_str: string;
        screen_name: string;
        connections: string[];
    }

    export interface Follow {
    }
}

interface TwitterParams {
    [key: string]: any;
}

interface FetchOptions {
    method: "get" | "post";
    muteHttpExceptions: true;
    payload?: string
}

interface Array<T> {
    includes<T>(obj: any): boolean;
}
