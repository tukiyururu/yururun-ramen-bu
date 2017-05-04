export class Twitter {
    private serviceName: string = "twitter";
    private apiUrl: string = "https://api.twitter.com/1.1/";

    private consumerKey: string = process.env.CONSUMER_KEY;
    private consumerSecret: string = process.env.CONSUMER_SECRET;
    private callbackFunc: string;

    constructor(callbackFunc: string) {
        this.callbackFunc = callbackFunc;
    }

    public callback(request: object): GoogleAppsScript.HTML.HtmlOutput {
        const serv = this.service();
        const isAuthorized = serv.handleCallback(request);
        if (isAuthorized) {
            return HtmlService.createHtmlOutput("認証に成功");
        } else {
            return HtmlService.createHtmlOutput("認証に失敗");
        }
    }

    public authorizeUrl(): void {
        const serv = this.service();
        if (!serv.hasAccess()) {
            Logger.log(serv.authorize());
        } else {
            Logger.log("認証済み");
        }
    }

    public clear(): void {
        return OAuth1.createService(this.serviceName)
            .setPropertyStore(PropertiesService.getUserProperties())
            .reset();
    }

    public homeTimeline(params: TwitterParams): false | TwitterJSON.Status[]  {
        const json = this.api<TwitterJSON.Status[]>("statuses/home_timeline", params);
        return json;
    }

    public update(params: TwitterParams): void {
        this.api<TwitterJSON.Status>("statuses/update", params);
    }

    public retweet(id: string): void {
        this.api<TwitterJSON.Status[]>(`statuses/retweet/${id}`);
    }

    public favorite(params: TwitterParams): void {
        this.api<TwitterJSON.Status>("favorites/create", params);
    }

    private service(): GoogleAppsScript.OAuth1.Service {
        return OAuth1.createService(this.serviceName)
            .setAccessTokenUrl("https://api.twitter.com/oauth/access_token")
            .setRequestTokenUrl("https://api.twitter.com/oauth/request_token")
            .setAuthorizationUrl("https://api.twitter.com/oauth/authorize")
            .setConsumerKey(this.consumerKey)
            .setConsumerSecret(this.consumerSecret)
            .setCallbackFunction(this.callbackFunc)
            .setPropertyStore(PropertiesService.getUserProperties());
    }

    private parse(params: TwitterParams): string {
        return Object.keys(params).map((key) => {
            return key + "=" + encodeURIComponent(params[key]);
        }).join("&");
    }

    private api<T>(path: string, params?: TwitterParams): false | T {
        const serv = this.service();
        if (serv.hasAccess()) {
            let url: string = `${this.apiUrl}${path}.json`;
            const method = (path === "statuses/home_timeline") ? "get" : "post";
            const opts: FetchOptions = {
                method: method,
                muteHttpExceptions: true
            };

            if (params) {
                if (method === "get") {
                    url += "?" + this.parse(params);
                } else if (method === "post") {
                    opts.payload = this.parse(params);
                }
            }

            try {
                const res = serv.fetch(url, opts);
                const json = JSON.parse(res.getContentText());
                if (this.empty(json) || json.error || json.errors) {
                    throw new Error(JSON.stringify(json));
                }
                return <T> json;
            } catch (err) {
                Logger.log(err.message || err);
            }
        }
        return false;
    }

    private empty(obj: any): boolean {
        if (obj.length > 0) {
            return false;
        }
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
}
