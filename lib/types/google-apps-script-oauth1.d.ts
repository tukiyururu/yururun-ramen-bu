declare namespace GoogleAppsScript {
    export module OAuth1 {
        export interface OAuth1 {
            createService(serviceName: string): Service;
        }

        export interface Service {
            setAccessTokenUrl(url: string): Service;
            setRequestTokenUrl(url: string): Service;
            setAuthorizationUrl(url: string): Service
            setConsumerKey(consumerKey: string): Service;
            setConsumerSecret(consumerSecret: string): Service;
            setCallbackFunction(callbackFunctionName: string): Service;
            setPropertyStore(propertyStore: Properties.Properties): Service;
            handleCallback(callbackRequest: Object): boolean;
            hasAccess(): boolean;
            authorize(): string;
            reset(): void;
            fetch(url: string, params: Object): URL_Fetch.HTTPResponse;
        }
    }
}

declare var OAuth1: GoogleAppsScript.OAuth1.OAuth1;
