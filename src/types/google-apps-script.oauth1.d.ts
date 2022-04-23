declare namespace GoogleAppsScript {
  namespace OAuth1 {
    interface OAuth1 {
      createService(serviceName: string): Service;
    }

    interface Service {
      setConsumerKey(consumerKey: string): Service;
      setConsumerSecret(consumerSecret: string): Service;
      setAccessTokenUrl(url: string): Service;
      setRequestTokenUrl(url: string): Service;
      setAuthorizationUrl(url: string): Service;
      setCallbackFunction(callbackFunctionName: string): Service;
      setPropertyStore(propertyStore: Properties.Properties): Service;
      handleCallback(callbackRequest: object): boolean;
      authorize(): string;
      reset(): void;
    }
  }
}

declare let OAuth1: GoogleAppsScript.OAuth1.OAuth1;
